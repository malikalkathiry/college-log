import { Suspense } from "react";
import Link from "next/link";
import { mockCourseRepository, mockTaskRepository } from "@/lib/repositories/mock";
import { formatTanggal, formatTanggalJam } from "@/lib/dates";
import PageHeader from "@/components/PageHeader";
import RiwayatFilters from "@/app/riwayat/RiwayatFilters";

export const dynamic = "force-dynamic";

type RiwayatSearchParams = {
  q?: string;
  course?: string;
  terlambat?: string;
};

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<RiwayatSearchParams>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const courseId = params.course ?? "";
  const terlambat = params.terlambat === "1";

  const courses = await mockCourseRepository.getCourses();
  const tasks = await mockTaskRepository.searchCompletedTasks({
    query,
    courseId: courseId || undefined,
    terlambat,
  });

  const hasFilter = Boolean(query || courseId || terlambat);

  return (
    <Suspense fallback={<div className="p-4 text-sm text-foreground-muted">Memuat...</div>}>
      <div className="flex min-h-screen flex-col">
        <PageHeader title="Riwayat" backHref="/" backLabel="Beranda" />

        <div className="flex-1 px-4 py-4">
          <RiwayatFilters
            courses={courses}
            initialQuery={query}
            initialCourseId={courseId}
            initialTerlambat={terlambat}
          />

          <div className="mt-4">
            {tasks.length === 0 ? (
              <div className="rounded border border-border bg-surface px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  {hasFilter ? "Tidak ada tugas yang cocok" : "Belum ada tugas selesai"}
                </p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {hasFilter
                    ? "Coba ubah kata kunci atau hapus filter."
                    : "Tugas yang sudah diselesaikan akan muncul di sini."}
                </p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-xs text-foreground-muted">
                  {tasks.length} tugas selesai
                </p>
                <ul className="space-y-2">
                  {tasks.map((task) => {
                    const completedAt = task.completed_date
                      ? new Date(task.completed_date)
                      : null;
                    if (completedAt) completedAt.setHours(0, 0, 0, 0);
                    const deadline = new Date(task.deadline);
                    deadline.setHours(0, 0, 0, 0);
                    const isLate =
                      completedAt !== null && completedAt.getTime() > deadline.getTime();

                    return (
                      <li key={task.id}>
                        <Link
                          href={`/tugas/${task.id}`}
                          className="block rounded border border-border bg-surface px-3 py-2.5 hover:bg-surface-hover"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {task.title}
                            </p>
                            {isLate ? (
                              <span className="shrink-0 rounded border border-danger px-1.5 py-0.5 text-xs text-danger">
                                Terlambat
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs text-foreground-muted">
                            {task.course_name} · {task.lecturer_name}
                          </p>
                          <p className="mt-1 text-xs text-foreground-muted">
                            Deadline {formatTanggalJam(task.deadline)}
                            {task.completed_date
                              ? ` · Selesai ${formatTanggal(task.completed_date)}`
                              : ""}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
