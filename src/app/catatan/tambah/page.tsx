import { mockCourseRepository } from "@/lib/repositories/mock";
import NoteForm from "@/app/catatan/NoteForm";

export const dynamic = "force-dynamic";

export default async function TambahCatatanPage() {
  const courses = await mockCourseRepository.getCourses();

  return <NoteForm courses={courses} />;
}
