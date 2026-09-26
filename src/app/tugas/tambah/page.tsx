import { mockCourseRepository, mockLecturerRepository } from "@/lib/repositories/mock";
import TaskForm from "@/app/tugas/TaskForm";

export const dynamic = "force-dynamic";

export default async function TambahTugasPage() {
  const [courses, lecturers] = await Promise.all([
    mockCourseRepository.getCourses(),
    mockLecturerRepository.getLecturers(),
  ]);

  return <TaskForm courses={courses} lecturers={lecturers} />;
}
