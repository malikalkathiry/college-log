import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock,
  ListTodo,
  Plus,
  StickyNote,
} from "lucide-react";
import { getCurrentDisplayName } from "@/lib/current-user";
import {
  mockTaskRepository,
  mockScheduleRepository,
  mockCourseRepository,
  mockNoteRepository,
} from "@/lib/repositories/mock";
import { formatJamSingkat, formatTanggal, getDeadlineLabel, getTodayHari } from "@/lib/dates";

export default async function DashboardPage() {
  const [displayName, groups, jadwalHariIni, courses, notes] = await Promise.all([
    getCurrentDisplayName(),
    mockTaskRepository.getTasksGrouped(),
    mockScheduleRepository.getScheduleByDay(getTodayHari()),
    mockCourseRepository.getCourses(),
    mockNoteRepository.getNotes(),
  ]);

  const { hari_ini: hariIni, besok, mendatang, terlambat } = groups;

  const prioritas = [...terlambat, ...hariIni, ...besok].slice(0, 5);
  const catatanTerbaru = notes.slice(0, 3);
  const hariIniLabel = formatTanggal(new Date().toISOString());

  const stats = [
    { label: "Terlambat", value: terlambat.length, icon: AlertTriangle, danger: true },
    { label: "Hari Ini", value: hariIni.length, icon: Clock, danger: false },
    { label: "Mendatang", value: mendatang.length + besok.length, icon: CalendarDays, danger: false },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-background px-4 py-4">
        <h1 className="text-lg font-semibold text-foreground">Halo, {displayName}</h1>
        <p className="mt-0.5 text-xs text-foreground-muted">{hariIniLabel}</p>
      </header>

      <div className="flex-1 space-y-5 px-4 py-4">
        <section className="grid grid-cols-3 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded border border-border bg-surface px-3 py-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-foreground">{stat.value}</span>
                  <Icon
                    size={16}
                    aria-hidden
                    className={stat.danger && stat.value > 0 ? "text-danger" : "text-foreground-muted"}
                  />
                </div>
                <p className="mt-0.5 text-xs text-foreground-muted">{stat.label}</p>
              </div>
            );
          })}
        </section>

        <section>
          <SectionHeading
            icon={<ListTodo size={15} aria-hidden />}
            title="Perlu Dikerjakan"
            href="/tugas"
          />
          {prioritas.length === 0 ? (
            <EmptyRow text="Tidak ada tugas mendesak. Aman." />
          ) : (
            <ul className="space-y-2">
              {prioritas.map((task) => {
                const overdue = getDeadlineLabel(task.deadline) === "Terlambat";
                return (
                  <li key={task.id}>
                    <Link
                      href={`/tugas/${task.id}`}
                      className="flex items-center justify-between gap-3 rounded border border-border bg-surface px-3 py-2.5 transition-colors hover:bg-surface-hover"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                        <p className="mt-0.5 truncate text-xs text-foreground-muted">
                          {task.course_name} · {task.lecturer_name}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs ${overdue ? "text-danger" : "text-foreground-muted"}`}>
                        {getDeadlineLabel(task.deadline)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <SectionHeading
            icon={<CalendarDays size={15} aria-hidden />}
            title={`Jadwal Hari Ini (${getTodayHari()})`}
            href="/jadwal"
          />
          {jadwalHariIni.length === 0 ? (
            <EmptyRow text="Tidak ada kelas hari ini." />
          ) : (
            <ul className="space-y-2">
              {jadwalHariIni.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 rounded border border-border bg-surface px-3 py-2.5"
                >
                  <span className="shrink-0 text-xs font-medium tabular-nums text-accent">
                    {formatJamSingkat(entry.start_time)}–{formatJamSingkat(entry.end_time)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{entry.course_name}</p>
                    {entry.room ? (
                      <p className="truncate text-xs text-foreground-muted">{entry.room}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <SectionHeading
              icon={<BookOpen size={15} aria-hidden />}
              title="Mata Kuliah"
              href="/mata-kuliah"
            />
            <Link
              href="/mata-kuliah"
              className="flex items-center justify-between rounded border border-border bg-surface px-3 py-2.5 transition-colors hover:bg-surface-hover"
            >
              <span className="text-sm text-foreground">
                {courses.length > 0 ? `${courses.length} mata kuliah terdaftar` : "Belum ada mata kuliah"}
              </span>
              <ChevronRight size={16} aria-hidden className="text-foreground-muted" />
            </Link>
          </div>

          <div>
            <SectionHeading
              icon={<StickyNote size={15} aria-hidden />}
              title="Catatan Terbaru"
              href="/catatan"
            />
            {catatanTerbaru.length === 0 ? (
              <EmptyRow text="Belum ada catatan." />
            ) : (
              <ul className="space-y-2">
                {catatanTerbaru.map((note) => (
                  <li key={note.id}>
                    <Link
                      href={`/catatan/${note.id}`}
                      className="block rounded border border-border bg-surface px-3 py-2.5 transition-colors hover:bg-surface-hover"
                    >
                      <p className="truncate text-sm text-foreground">{note.title}</p>
                      <p className="mt-0.5 truncate text-xs text-foreground-muted">{note.course_name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <Link
          href="/tugas/tambah"
          className="flex items-center justify-center gap-1.5 rounded border border-dashed border-border py-2.5 text-sm text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <Plus size={16} aria-hidden />
          Tambah Tugas
        </Link>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <span className="text-foreground-muted">{icon}</span>
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-0.5 text-xs text-foreground-muted transition-colors hover:text-accent"
      >
        Lihat
        <ChevronRight size={13} aria-hidden />
      </Link>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded border border-border bg-surface px-3 py-3 text-xs text-foreground-muted">
      {text}
    </div>
  );
}
