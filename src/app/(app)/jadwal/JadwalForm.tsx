"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Course, Lecturer, ScheduleEntry } from "@/types";
import PageHeader from "@/components/PageHeader";
import { createSchedule, updateSchedule } from "@/app/actions";
import { HARI } from "@/lib/dates";

export default function JadwalForm({
  courses,
  lecturers,
  entry,
  footer,
}: {
  courses: Course[];
  lecturers: Lecturer[];
  entry?: ScheduleEntry;
  footer?: React.ReactNode;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [courseId, setCourseId] = useState(entry?.course_id ?? "");

  const lecturerName = useMemo(() => {
    if (!courseId) return "";
    const course = courses.find((c) => c.id === courseId);
    if (!course) return "";
    return lecturers.find((l) => l.id === course.lecturer_id)?.name ?? "—";
  }, [courseId, courses, lecturers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = entry?.id
      ? await updateSchedule(entry.id, formData)
      : await createSchedule(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/jadwal");
    router.refresh();
  };

  const backHref = "/jadwal";
  const title = entry?.id ? "Edit Jadwal" : "Tambah Jadwal";

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={title} backHref={backHref} />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="space-y-4">
          {error && (
            <p className="rounded border border-danger bg-surface px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="course_id" className="mb-1 block text-sm text-foreground-muted">
              Mata Kuliah
            </label>
            <select
              id="course_id"
              name="course_id"
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">Pilih mata kuliah</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="mt-1 text-xs text-danger">
                Belum ada mata kuliah. Tambahkan di halaman Mata Kuliah terlebih dahulu.
              </p>
            )}
          </div>

          {lecturerName && (
            <div className="rounded border border-border bg-surface px-3 py-2 text-sm">
              <span className="text-foreground-muted">Dosen: </span>
              <span className="text-foreground">{lecturerName}</span>
            </div>
          )}

          <div>
            <label htmlFor="day_of_week" className="mb-1 block text-sm text-foreground-muted">
              Hari
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              required
              defaultValue={entry?.day_of_week ?? "Senin"}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              {HARI.map((hari) => (
                <option key={hari} value={hari}>
                  {hari}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start_time" className="mb-1 block text-sm text-foreground-muted">
                Jam Mulai
              </label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                required
                defaultValue={entry?.start_time ?? ""}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="mb-1 block text-sm text-foreground-muted">
                Jam Selesai
              </label>
              <input
                id="end_time"
                name="end_time"
                type="time"
                required
                defaultValue={entry?.end_time ?? ""}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="room" className="mb-1 block text-sm text-foreground-muted">
              Ruangan
            </label>
            <input
              id="room"
              name="room"
              type="text"
              required
              defaultValue={entry?.room ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: Ruang 204"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        {footer && <div className="mt-6">{footer}</div>}
      </form>
    </div>
  );
}
