"use client";

import { useEffect, useRef, useState } from "react";

export function AppSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <form
      action="/"
      className="app-search"
      onSubmit={() => setIsSubmitting(true)}
      role="search"
      aria-busy={isSubmitting}
    >
      <label className="sr-only" htmlFor="applicant-search">
        Search applicants
      </label>
      <input
        ref={inputRef}
        id="applicant-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search name or case ID"
        autoComplete="off"
        aria-describedby="search-shortcut"
      />
      <span id="search-shortcut" aria-hidden className="app-search__shortcut">
        Ctrl K
      </span>
      <button type="submit" className="app-search__button" disabled={isSubmitting}>
        {isSubmitting ? "…" : "Search"}
      </button>
    </form>
  );
}
