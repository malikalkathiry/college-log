import Link from "next/link";
import { mockNoteRepository } from "@/lib/repositories/mock";
import { formatTanggal } from "@/lib/dates";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function CatatanPage() {
  const notes = await mockNoteRepository.getNotes();

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Catatan"
        action={
          <Link
            href="/catatan/tambah"
            className="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            + Tambah
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {sortedNotes.length === 0 && (
          <div className="rounded border border-border bg-surface px-4 py-8 text-center">
            <p className="text-sm text-foreground-muted">Belum ada catatan.</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Tekan &quot;+ Tambah&quot; untuk menambahkan catatan baru.
            </p>
          </div>
        )}

        {sortedNotes.length > 0 && (
          <ul className="space-y-2">
            {sortedNotes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/catatan/${note.id}`}
                  className="block rounded border border-border bg-surface px-3 py-2.5 hover:bg-surface-hover"
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {note.title}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {note.course_name}
                  </p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    Diperbarui {formatTanggal(note.updated_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
