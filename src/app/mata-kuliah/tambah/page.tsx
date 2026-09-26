import { mockLecturerRepository } from "@/lib/repositories/mock";
import CourseForm from "@/app/mata-kuliah/CourseForm";

export const dynamic = "force-dynamic";

export default async function TambahMataKuliahPage() {
  const lecturers = await mockLecturerRepository.getLecturers();

  return <CourseForm lecturers={lecturers} />;
}
