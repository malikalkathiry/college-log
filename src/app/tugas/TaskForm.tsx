"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { Course, Lecturer, TaskStatus } from "@/types";
import PageHeader from "@/components/PageHeader";
import { createTask, updateTask } from "@/app/actions";
import { getTodayString, JAM_DEFAULT, pisahkanDeadline } from "@/lib/dates";

type TaskFormValues = {
  id?: string;
  title: string;
  course_id: string;
  assigned_date: string;
  deadline: string;
  context: string;
  status?: TaskStatus;
};

export default function TaskForm({
  courses,
  lecturers,
  task,
}: {
  courses: Course[];
  lecturers: Lecturer[];
  task?: TaskFormValues;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [courseId, setCourseId] = useState(task?.course_id ?? "");

  const deadlineAwal = pisahkanDeadline(task?.deadline ?? "");

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
    const result = task?.id
      ? await updateTask(task.id, formData)
      : await createTask(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(task?.id ? `/tugas/${task.id}` : "/tugas");
    router.refresh();
  };

  const backHref = task?.id ? `/tugas/${task.id}` : "/tugas";
  const title = task?.id ? "Edit Tugas" : "Tambah Tugas";

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title={title} backHref={backHref} />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="space-y-4">
          {error && (
            <p className="rounded border border-danger bg-surface px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-foreground-muted">
              Judul Tugas
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={task?.title ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: Laporan Sorting"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="assigned_date" className="mb-1 block text-sm text-foreground-muted">
                Diberikan
              </label>
              <input
                id="assigned_date"
                name="assigned_date"
                type="date"
                required
                defaultValue={task?.assigned_date ?? getTodayString()}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Deadline
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  defaultValue={deadlineAwal.tanggal || getTodayString()}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
                <input
                  id="deadline_jam"
                  name="deadline_jam"
                  type="time"
                  required
                  defaultValue={deadlineAwal.jam || JAM_DEFAULT}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="context" className="mb-1 block text-sm text-foreground-muted">
              Konteks / Instruksi
            </label>
            <textarea
              id="context"
              name="context"
              required
              rows={3}
              defaultValue={task?.context ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Deskripsi tugas, instruksi, atau konteks..."
            />
          </div>

          <div>
            <label htmlFor="link" className="mb-1 block text-sm text-foreground-muted">
              Tautan <span className="text-foreground-muted">(opsional)</span>
            </label>
            <input
              id="link"
              name="link"
              type="url"
              defaultValue={(task as Record<string, unknown>)?.link as string ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="https://..."
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
      </form>
    </div>
  );
}
