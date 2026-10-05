"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logout } from "@/app/auth/actions";

type UserMenuProps = {
  username: string;
  /** "sidebar" = melebar penuh; "header" = versi ringkas untuk mobile. */
  variant?: "sidebar" | "header";
};

export default function UserMenu({ username, variant = "sidebar" }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    await logout();
    router.push("/masuk");
    router.refresh();
  }

  const initial = username.charAt(0).toUpperCase() || "?";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-2.5 rounded px-2 py-2 text-left transition-colors hover:bg-surface-hover ${
          variant === "header" ? "" : "border border-transparent"
        }`}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          {initial}
        </span>
        {variant === "header" ? (
          <span className="sr-only">{username}</span>
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {username}
          </span>
        )}
        <ChevronDown
          size={15}
          aria-hidden
          className={`shrink-0 text-foreground-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute w-full min-w-44 overflow-hidden rounded border border-border bg-surface shadow-lg ${
            variant === "header" ? "right-0 top-full mt-2" : "bottom-full left-0 mb-2"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-foreground-muted">
            <User size={14} aria-hidden />
            <span className="truncate">{username}</span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground-muted transition-colors hover:bg-surface-hover hover:text-danger disabled:opacity-50"
          >
            <LogOut size={15} aria-hidden />
            {loading ? "Keluar..." : "Keluar"}
          </button>
        </div>
      )}
    </div>
  );
}
