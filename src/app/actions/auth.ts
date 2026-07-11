"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  getCurrentUser,
  verifyPassword,
} from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  await db.auditEvent.create({
    data: {
      actorId: user.id,
      action: "USER_SIGNED_IN",
      details: `${user.name} signed in.`,
    },
  });

  redirect("/");
}

export async function logout() {
  const user = await getCurrentUser();
  if (user) {
    await db.auditEvent.create({
      data: {
        actorId: user.id,
        action: "USER_SIGNED_OUT",
        details: `${user.name} signed out.`,
      },
    });
  }
  await destroySession();
  redirect("/login");
}
