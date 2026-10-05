"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Course, Note } from "@/types";
import PageHeader from "@/components/PageHeader";
import { createNote, updateNote } from "@/app/actions";

type NoteFormValues = Pick<Note, "id" | "course_id" | "title" | "content">;

export default function NoteForm({
  courses,
  note,
}: {
  courses: Course[];
  note?: NoteFormValues;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = note?.id
      ? await updateNote(note.id, formData)
      : await createNote(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/catatan");
    router.refresh();
  };

  const backHref = note?.id ? `/catatan/${note.id}` : "/catatan";
  const title = note?.id ? "Edit Catatan" : "Tambah Catatan";

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
            <label htmlFor="title" className="mb-1 block text-sm text-foreground-muted">
              Judul
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={note?.title ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: Catatan Algoritma Sorting"
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
              defaultValue={note?.course_id ?? ""}
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

          <div>
            <label htmlFor="content" className="mb-1 block text-sm text-foreground-muted">
              Isi Catatan
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              defaultValue={note?.content ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="# Judul&#10;&#10;Isi catatan dalam format Markdown..."
            />
            <p className="mt-1 text-xs text-foreground-muted">
              Mendukung Markdown: **bold**, *italic*, `kode`, # heading, daftar, tautan, blok kode.
            </p>
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
