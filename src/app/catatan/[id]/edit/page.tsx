import { notFound } from "next/navigation";
import { mockCourseRepository, mockNoteRepository } from "@/lib/repositories/mock";
import NoteForm from "@/app/catatan/NoteForm";

export const dynamic = "force-dynamic";

export default async function EditCatatanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const note = await mockNoteRepository.getNoteById(id);
  if (!note) {
    notFound();
  }

  const courses = await mockCourseRepository.getCourses();

  return <NoteForm courses={courses} note={note} />;
}
