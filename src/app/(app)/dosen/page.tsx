import Link from "next/link";
import { mockLecturerRepository } from "@/lib/repositories/mock";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import DeleteLecturerButton from "./DeleteLecturerButton";


export default async function DosenPage() {
  const lecturers = await mockLecturerRepository.getLecturers();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Dosen"
        backHref="/"
        backLabel="Beranda"
        action={
          <Link
            href="/dosen/tambah"
            className="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            + Tambah
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {lecturers.length === 0 ? (
          <EmptyState
            title="Belum ada dosen"
            description="Tambahkan dosen untuk mengelola mata kuliah."
            action={
              <Link
                href="/dosen/tambah"
                className="inline-block rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                + Tambah Dosen
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {lecturers.map((lecturer) => (
              <li
                key={lecturer.id}
                className="rounded border border-border bg-surface"
              >
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <Link
                    href={`/dosen/${lecturer.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-foreground">
                      {lecturer.name}
                    </p>
                    {lecturer.contact && (
                      <p className="mt-0.5 truncate text-xs text-foreground-muted">
                        {lecturer.contact}
                      </p>
                    )}
                  </Link>
                  <DeleteLecturerButton id={lecturer.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
