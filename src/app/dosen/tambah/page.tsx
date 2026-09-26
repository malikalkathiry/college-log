"use client";

import { useRouter } from "next/navigation";
import { createLecturer } from "@/app/actions";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function TambahDosenPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createLecturer(formData);

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dosen");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Tambah Dosen" backHref="/" backLabel="Beranda" />

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
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: Dr. Budi Santoso"
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
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
              placeholder="Contoh: budi@kampus.ac.id"
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
