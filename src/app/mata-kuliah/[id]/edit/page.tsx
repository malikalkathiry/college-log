import { notFound } from "next/navigation";
import { mockCourseRepository, mockLecturerRepository } from "@/lib/repositories/mock";
import CourseForm from "@/app/mata-kuliah/CourseForm";

export const dynamic = "force-dynamic";

export default async function EditMataKuliahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await mockCourseRepository.getCourseById(id);
  if (!course) {
    notFound();
  }

  const lecturers = await mockLecturerRepository.getLecturers();

  return <CourseForm lecturers={lecturers} course={course} />;
}
