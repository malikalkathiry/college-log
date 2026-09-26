import { notFound } from "next/navigation";
import Link from "next/link";
import { mockCourseRepository, mockLecturerRepository } from "@/lib/repositories/mock";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function MataKuliahDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await mockCourseRepository.getCourseById(id);

  if (!course) {
    notFound();
  }

  const lecturer = course.lecturer_id
    ? await mockLecturerRepository.getLecturerById(course.lecturer_id)
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title={course.name} backHref="/" backLabel="Beranda" />

      <div className="px-4 py-6">
        <div className="space-y-5">
          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Informasi
            </h2>
            <div className="space-y-2 rounded border border-border bg-surface px-3 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Kode</span>
                <span className="text-foreground">{course.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">SKS</span>
                <span className="text-foreground">{course.credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Dosen</span>
                <span className="text-foreground">
                  {lecturer?.name ?? "—"}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Tugas
            </h2>
            <p className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground-muted">
              Fitur tugas segera hadir.
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Catatan
            </h2>
            <p className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground-muted">
              Fitur catatan segera hadir.
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Jadwal
            </h2>
            <p className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground-muted">
              Fitur jadwal segera hadir.
            </p>
          </section>
        </div>

        <div className="mt-6">
          <Link
            href={`/mata-kuliah/${course.id}/edit`}
            className="block w-full rounded border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Edit Mata Kuliah
          </Link>
        </div>
      </div>
    </div>
  );
}
