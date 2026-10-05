import { mockLecturerRepository } from "@/lib/repositories/mock";
import CourseForm from "@/app/(app)/mata-kuliah/CourseForm";


export default async function TambahMataKuliahPage() {
  const lecturers = await mockLecturerRepository.getLecturers();

  return <CourseForm lecturers={lecturers} />;
}
