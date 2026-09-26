import { notFound } from "next/navigation";
import Link from "next/link";
import { mockLecturerRepository } from "@/lib/repositories/mock";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function DosenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lecturer = await mockLecturerRepository.getLecturerById(id);

  if (!lecturer) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title={lecturer.name} backHref="/" backLabel="Beranda" />

      <div className="px-4 py-6">
        <div className="space-y-5">
          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Informasi
            </h2>
            <div className="space-y-2 rounded border border-border bg-surface px-3 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Nama</span>
                <span className="text-foreground">{lecturer.name}</span>
              </div>
              {lecturer.contact && (
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Kontak</span>
                  <span className="text-foreground">{lecturer.contact}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href={`/dosen/${lecturer.id}/edit`}
            className="block w-full rounded border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Edit Dosen
          </Link>
        </div>
      </div>
    </div>
  );
}
