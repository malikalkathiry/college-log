"use client";

import { useRouter } from "next/navigation";
import { updateLecturer } from "@/app/actions";
import { useState, useEffect } from "react";
import type { Lecturer } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function EditDosenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      fetch("/api/lecturers")
        .then((r) => r.json())
        .then((data: Lecturer[]) => {
          const found = data.find((l) => l.id === id);
          if (found) setLecturer(found);
        })
        .catch(() => {});
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lecturer) return;

    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateLecturer(lecturer.id, formData);

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/dosen/${lecturer.id}`);
      router.refresh();
    }
  };

  if (!lecturer) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="Edit Dosen" backHref="/" backLabel="Beranda" />
        <div className="px-4 py-6">
          <p className="text-sm text-foreground-muted">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Edit Dosen" backHref="/" backLabel="Beranda" />

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
              Nama Dosen
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={lecturer.name}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="mb-1 block text-sm text-foreground-muted"
            >
              Kontak <span className="text-foreground-muted">(opsional)</span>
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              defaultValue={lecturer.contact ?? ""}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
            />
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
