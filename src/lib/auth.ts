import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "kyc_session";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SCRYPT_KEYLEN = 64;

export type SessionUser = Pick<User, "id" | "name" | "email" | "role">;

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, digest] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !digest) {
    return false;
  }
  const expected = Buffer.from(digest, "hex");
  const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return session.user;
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/?denied=1");
  }
  return user;
}
