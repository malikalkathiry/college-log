import Link from "next/link";
import { BookOpen, GraduationCap, History, Plus } from "lucide-react";
import { mockTaskRepository } from "@/lib/repositories/mock";
import { formatTanggalJam, getDeadlineLabel } from "@/lib/dates";

export default async function TugasPage() {
  const {
    hari_ini: hariIniTasks,
    besok: besokTasks,
    mendatang: mendatangTasks,
    terlambat: terlambatTasks,
    selesai: completedTasks,
  } = await mockTaskRepository.getTasksGrouped();

  const hasActiveTasks = hariIniTasks.length + besokTasks.length + mendatangTasks.length + terlambatTasks.length > 0;
  const hasCompletedTasks = completedTasks.length > 0;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Tugas</h1>
          <div className="flex items-center gap-1">
            <Link
              href="/riwayat"
              className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <History size={15} aria-hidden />
              <span className="hidden sm:inline">Riwayat</span>
            </Link>
            <Link
              href="/mata-kuliah"
              className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <BookOpen size={15} aria-hidden />
              <span className="hidden sm:inline">Mata Kuliah</span>
            </Link>
            <Link
              href="/dosen"
              className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <GraduationCap size={15} aria-hidden />
              <span className="hidden sm:inline">Dosen</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        <div className="mb-4 flex justify-end">
          <Link
            href="/tugas/tambah"
            className="flex items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Plus size={16} aria-hidden />
            Tambah Tugas
          </Link>
        </div>

        {!hasActiveTasks && !hasCompletedTasks && (
          <div className="rounded border border-border bg-surface px-4 py-8 text-center">
            <p className="text-sm text-foreground-muted">Belum ada tugas.</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Tekan &quot;+ Tambah Tugas&quot; untuk menambahkan tugas baru.
            </p>
          </div>
        )}

        {terlambatTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-danger">Terlambat</h2>
            <ul className="space-y-2">
              {terlambatTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}

        {hariIniTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-foreground-muted">Hari Ini</h2>
            <ul className="space-y-2">
              {hariIniTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}

        {besokTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-foreground-muted">Besok</h2>
            <ul className="space-y-2">
              {besokTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}

        {mendatangTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-foreground-muted">Mendatang</h2>
            <ul className="space-y-2">
              {mendatangTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}

        {hasCompletedTasks && (
          <section className="mt-8">
            <h2 className="mb-2 text-sm font-medium text-foreground-muted">Selesai</h2>
            <ul className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} completed />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, completed = false }: { task: { id: string; title: string; course_name: string; course_code: string; deadline: string }; completed?: boolean }) {
  return (
    <li>
      <Link
        href={`/tugas/${task.id}`}
        className={`block rounded border border-border px-3 py-2 hover:bg-surface ${completed ? "opacity-60" : "bg-surface"}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${completed ? "line-through text-foreground-muted" : "text-foreground"}`}>
              {task.title}
            </p>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {task.course_name} · {completed ? formatTanggalJam(task.deadline) : getDeadlineLabel(task.deadline)}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}