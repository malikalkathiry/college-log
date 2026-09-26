"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/auth/actions";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    await logout();
    router.push("/masuk");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded bg-surface border border-border px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground disabled:opacity-50"
    >
      {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}
