import Link from "next/link";
import { mockCourseRepository, mockLecturerRepository } from "@/lib/repositories/mock";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import DeleteCourseButton from "./DeleteCourseButton";


export default async function MataKuliahPage() {
  const courses = await mockCourseRepository.getCourses();
  const lecturers = await mockLecturerRepository.getLecturers();

  const getLecturerName = (lecturerId: string) => {
    const lecturer = lecturers.find((l) => l.id === lecturerId);
    return lecturer?.name ?? "—";
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Mata Kuliah"
        backHref="/"
        backLabel="Beranda"
        action={
          <Link
            href="/mata-kuliah/tambah"
            className="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            + Tambah
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {courses.length === 0 ? (
          <EmptyState
            title="Belum ada mata kuliah"
            description="Tambahkan mata kuliah untuk mulai mengelola tugas."
            action={
              <Link
                href="/mata-kuliah/tambah"
                className="inline-block rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                + Tambah Mata Kuliah
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course.id}
                className="rounded border border-border bg-surface"
              >
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <Link
                    href={`/mata-kuliah/${course.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-foreground">
                      {course.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-foreground-muted">
                      {course.code} &middot; {course.credits} SKS &middot;{" "}
                      {getLecturerName(course.lecturer_id)}
                    </p>
                  </Link>
                  <DeleteCourseButton id={course.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
