import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  History,
  LayoutDashboard,
  ListTodo,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Navigasi utama — dipakai bersama oleh sidebar (desktop) dan nav bawah (mobile). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tugas", label: "Tugas", icon: ListTodo },
  { href: "/jadwal", label: "Jadwal", icon: CalendarDays },
  { href: "/catatan", label: "Catatan", icon: StickyNote },
  { href: "/mata-kuliah", label: "Mata Kuliah", icon: BookOpen },
  { href: "/dosen", label: "Dosen", icon: GraduationCap },
  { href: "/riwayat", label: "Riwayat", icon: History },
];

/** Subset untuk bottom navigation di mobile (ruang terbatas). */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
];

/** Cek apakah sebuah nav item aktif untuk pathname saat ini. */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
