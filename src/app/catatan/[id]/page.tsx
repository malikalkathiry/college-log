import { notFound } from "next/navigation";
import Link from "next/link";
import { mockNoteRepository } from "@/lib/repositories/mock";
import { formatTanggal } from "@/lib/dates";
import PageHeader from "@/components/PageHeader";
import NoteContent from "@/components/NoteContent";
import DeleteNoteButton from "./DeleteNoteButton";

export const dynamic = "force-dynamic";

export default async function CatatanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await mockNoteRepository.getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title={note.title}
        backHref="/catatan"
        action={
          <Link
            href={`/catatan/${note.id}/edit`}
            className="shrink-0 text-sm text-foreground-muted hover:text-foreground"
          >
            Edit
          </Link>
        }
      />

      <div className="px-4 py-6">
        <div className="space-y-5">
          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Mata Kuliah</h2>
            <p className="text-sm text-foreground">{note.course_name}</p>
            <p className="text-xs text-foreground-muted">{note.course_code}</p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Isi Catatan</h2>
            <div className="rounded border border-border bg-surface px-3 py-3">
              <NoteContent content={note.content} />
            </div>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Informasi</h2>
            <div className="space-y-1 rounded border border-border bg-surface px-3 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Dibuat</span>
                <span className="text-foreground">{formatTanggal(note.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Terakhir diperbarui</span>
                <span className="text-foreground">{formatTanggal(note.updated_at)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href={`/catatan/${note.id}/edit`}
            className="block w-full rounded border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Edit Catatan
          </Link>
          <DeleteNoteButton id={note.id} />
        </div>
      </div>
    </div>
  );
}
