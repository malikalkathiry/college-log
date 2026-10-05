"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Course, Lecturer } from "@/types";
import PageHeader from "@/components/PageHeader";
import { createCourse, updateCourse } from "@/app/actions";

export default function CourseForm({
  lecturers,
  course,
}: {
  lecturers: Lecturer[];
  course?: Course;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const backHref = "/";
  const title = course ? "Edit Mata Kuliah" : "Tambah Mata Kuliah";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = course
      ? await updateCourse(course.id, formData)
      : await createCourse(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(course ? `/mata-kuliah/${course.id}` : "/mata-kuliah");
    router.refresh();
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={title} backHref={backHref} backLabel="Beranda" />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="space-y-4">
          {error && (
            <p className="rounded border border-danger bg-surface px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm text-foreground-muted"
            >
              Nama Mata Kuliah
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={course?.name ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: Algoritma Pemrograman"
            />
          </div>

          <div>
            <label
              htmlFor="code"
              className="mb-1 block text-sm text-foreground-muted"
            >
              Kode Mata Kuliah
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              defaultValue={course?.code ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: CS101"
            />
          </div>

          <div>
            <label
              htmlFor="credits"
              className="mb-1 block text-sm text-foreground-muted"
            >
              SKS
            </label>
            <input
              id="credits"
              name="credits"
              type="number"
              min="1"
              max="6"
              required
              defaultValue={course?.credits ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: 3"
            />
          </div>

          <div>
            <label
              htmlFor="lecturer_id"
              className="mb-1 block text-sm text-foreground-muted"
            >
              Dosen
            </label>
            <select
              id="lecturer_id"
              name="lecturer_id"
              required
              defaultValue={course?.lecturer_id ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">Pilih dosen</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </option>
              ))}
            </select>
            {lecturers.length === 0 && (
              <p className="mt-1 text-xs text-danger">
                Belum ada dosen. Tambahkan di halaman Dosen terlebih dahulu.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
