import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

type SidebarProps = {
  username: string;
};

/**
 * Sidebar kiri untuk desktop. Fixed agar tidak ikut scroll dan tidak
 * di-render ulang saat berpindah route (layout persisten).
 */
export default function Sidebar({ username }: SidebarProps) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-60 flex-col border-r border-border bg-surface">
      <Link
        href="/"
        className="flex items-center gap-2.5 border-b border-border px-4 py-4 transition-colors hover:bg-surface-hover"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded bg-accent text-white">
          <GraduationCap size={18} aria-hidden />
        </span>
        <span className="text-sm font-semibold text-foreground">College Log</span>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} variant="sidebar" />
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <UserMenu username={username} />
      </div>
    </aside>
  );
}
