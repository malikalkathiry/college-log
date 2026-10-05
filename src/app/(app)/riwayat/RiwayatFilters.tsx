"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";
import type { Course } from "@/types";

export default function RiwayatFilters({
  courses,
  initialQuery,
  initialCourseId,
  initialTerlambat,
}: {
  courses: Course[];
  initialQuery: string;
  initialCourseId: string;
  initialTerlambat: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `/riwayat?${qs}` : "/riwayat");
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="space-y-3">
      <input
        type="search"
        name="q"
        defaultValue={initialQuery}
        onChange={(e) => push({ q: e.target.value || null })}
        placeholder="Cari tugas, mata kuliah, atau dosen..."
        className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
      />

      <div className="flex gap-2">
        <select
          name="course"
          defaultValue={initialCourseId}
          onChange={(e) => push({ course: e.target.value || null })}
          className="min-w-0 flex-1 rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          <option value="">Semua mata kuliah</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            push({ terlambat: initialTerlambat ? null : "1" })
          }
          className={`shrink-0 rounded border px-3 py-2 text-xs font-medium transition-colors ${
            initialTerlambat
              ? "border-danger bg-surface text-danger"
              : "border-border bg-surface text-foreground-muted hover:text-foreground"
          }`}
          aria-pressed={initialTerlambat}
        >
          Terlambat
        </button>
      </div>

      {(initialQuery || initialCourseId || initialTerlambat) && (
        <button
          type="button"
          onClick={() => {
            push({ q: null, course: null, terlambat: null });
          }}
          className="text-xs text-foreground-muted hover:text-foreground"
        >
          Hapus filter
        </button>
      )}

      {isPending ? (
        <span className="text-xs text-foreground-muted">Memuat...</span>
      ) : null}
    </div>
  );
}