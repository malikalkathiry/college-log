import { mockCourseRepository } from "@/lib/repositories/mock";
import NoteForm from "@/app/(app)/catatan/NoteForm";


export default async function TambahCatatanPage() {
  const courses = await mockCourseRepository.getCourses();

  return <NoteForm courses={courses} />;
}
