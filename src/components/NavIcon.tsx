"use client";

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
import type { NavIconName } from "@/lib/nav";

/**
 * Registry ikon navigasi.
 *
 * Komponen Lucide hanya hidup di modul client ini. Data navigasi di `lib/nav.ts`
 * menyimpan nama ikon sebagai string, lalu di-resolve di sini — sehingga tidak
 * ada fungsi React yang melewati batas Server -> Client.
 */
const ICONS: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  tugas: ListTodo,
  jadwal: CalendarDays,
  catatan: StickyNote,
  "mata-kuliah": BookOpen,
  dosen: GraduationCap,
  riwayat: History,
};

type NavIconProps = {
  name: NavIconName;
  size?: number;
  className?: string;
};

export default function NavIcon({ name, size = 18, className }: NavIconProps) {
  const Icon = ICONS[name];
  return <Icon size={size} className={className} aria-hidden />;
}
