import { MOBILE_NAV_ITEMS } from "@/lib/nav";
import NavLink from "./NavLink";

/**
 * Navigasi bawah untuk mobile. Di desktop disembunyikan karena
 * navigasi utama pindah ke Sidebar (kiri).
 */
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center">
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} variant="bottom" />
        ))}
      </div>
    </nav>
  );
}
