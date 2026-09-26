import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LogoutButton from "@/components/LogoutButton";

const menuItems = [
  { href: "/tugas", label: "Tugas", desc: "Kelola tugas dan deadline" },
  { href: "/jadwal", label: "Jadwal", desc: "Jadwal kuliah mingguan" },
  { href: "/catatan", label: "Catatan", desc: "Catatan kuliah" },
  { href: "/mata-kuliah", label: "Mata Kuliah", desc: "Daftar mata kuliah" },
  { href: "/dosen", label: "Dosen", desc: "Daftar dosen" },
  { href: "/riwayat", label: "Riwayat", desc: "Tugas yang sudah selesai" },
];

export default function BerandaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="College Log" action={<LogoutButton />} />

      <div className="flex-1 px-4 py-4">
        <ul className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col justify-center rounded border border-border bg-surface px-3 py-4 hover:bg-surface-hover"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="mt-1 text-xs leading-snug text-foreground-muted">
                  {item.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
