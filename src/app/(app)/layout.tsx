import { getCurrentDisplayName } from "@/lib/current-user";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import BottomNav from "@/components/BottomNav";

/**
 * Layout untuk halaman aplikasi (setelah login).
 *
 * Layout ini persisten: ia TIDAK di-render ulang saat berpindah route, sehingga
 * sidebar/header tetap responsif dan tidak berkedip selama transisi halaman.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const displayName = await getCurrentDisplayName();

  return (
    <>
      <Sidebar username={displayName} />

      <div className="md:pl-60">
        {/* Bar atas khusus mobile (desktop pakai sidebar). */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
          <span className="text-sm font-semibold text-foreground">College Log</span>
          <UserMenu username={displayName} variant="header" />
        </div>

        <main className="mx-auto min-h-screen max-w-lg pb-14 md:max-w-3xl md:pb-0">
          {children}
        </main>
      </div>

      <BottomNav />
    </>
  );
}
