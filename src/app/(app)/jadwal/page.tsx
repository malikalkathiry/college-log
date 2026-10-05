import Link from "next/link";
import { mockScheduleRepository } from "@/lib/repositories/mock";
import { HARI, formatJamSingkat } from "@/lib/dates";
import PageHeader from "@/components/PageHeader";


export default async function JadwalPage() {
  const entries = await mockScheduleRepository.getSchedule();

  const byDay = Object.fromEntries(
    HARI.map((hari) => [
      hari,
      entries
        .filter((e) => e.day_of_week === hari)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    ])
  );

  const totalEntries = entries.length;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Jadwal"
        action={
          <Link
            href="/jadwal/tambah"
            className="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            + Tambah
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {totalEntries === 0 && (
          <div className="rounded border border-border bg-surface px-4 py-8 text-center">
            <p className="text-sm text-foreground-muted">Belum ada jadwal.</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Tekan &quot;+ Tambah&quot; untuk menambahkan jadwal baru.
            </p>
          </div>
        )}

        {HARI.map((hari) => {
          const items = byDay[hari];
          if (items.length === 0) return null;

          return (
            <section key={hari} className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-foreground-muted">{hari}</h2>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/jadwal/${item.id}/edit`}
                      className="block rounded border border-border bg-surface px-3 py-2 hover:bg-surface-hover"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {item.course_name}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground-muted">
                            {item.lecturer_name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-foreground">
                            {formatJamSingkat(item.start_time)}–{formatJamSingkat(item.end_time)}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground-muted">{item.room}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
