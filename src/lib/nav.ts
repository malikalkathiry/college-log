/**
 * Konfigurasi navigasi.
 *
 * PENTING: file ini hanya berisi data biasa (string) — TIDAK boleh mengimpor
 * komponen ikon. Data ini dipakai oleh Server Component (BottomNav) dan Client
 * Component (NavLink). Kalau komponen React (fungsi) dimasukkan ke sini, ia ikut
 * terkirim sebagai prop dari server ke client dan memicu error serialisasi
 * "Only plain objects can be passed to Client Components".
 *
 * Nama ikon di-resolve menjadi komponen di `components/NavIcon.tsx` (client).
 */

export type NavIconName =
  | "dashboard"
  | "tugas"
  | "jadwal"
  | "catatan"
  | "mata-kuliah"
  | "dosen"
  | "riwayat";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

/** Navigasi utama — dipakai bersama oleh sidebar (desktop) dan nav bawah (mobile). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/tugas", label: "Tugas", icon: "tugas" },
  { href: "/jadwal", label: "Jadwal", icon: "jadwal" },
  { href: "/catatan", label: "Catatan", icon: "catatan" },
  { href: "/mata-kuliah", label: "Mata Kuliah", icon: "mata-kuliah" },
  { href: "/dosen", label: "Dosen", icon: "dosen" },
  { href: "/riwayat", label: "Riwayat", icon: "riwayat" },
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
