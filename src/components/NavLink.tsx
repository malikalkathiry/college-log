"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, type NavItem } from "@/lib/nav";
import NavIcon from "./NavIcon";

type NavLinkProps = {
  item: NavItem;
  variant: "sidebar" | "bottom";
};

/** Satu link navigasi dengan status aktif. Dipakai sidebar & bottom nav. */
export default function NavLink({ item, variant }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavActive(item.href, pathname);

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors ${
          active ? "text-accent" : "text-foreground-muted hover:text-foreground"
        }`}
      >
        <NavIcon name={item.icon} size={20} />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-surface-hover font-medium text-accent"
          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      <NavIcon name={item.icon} size={18} />
      <span>{item.label}</span>
    </Link>
  );
}
