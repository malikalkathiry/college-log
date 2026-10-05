import { notFound } from "next/navigation";
import { mockCourseRepository, mockLecturerRepository, mockTaskRepository } from "@/lib/repositories/mock";
import TaskForm from "@/app/(app)/tugas/TaskForm";


export default async function EditTugasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const task = await mockTaskRepository.getTaskById(id);
  if (!task) {
    notFound();
  }

  const [courses, lecturers] = await Promise.all([
    mockCourseRepository.getCourses(),
    mockLecturerRepository.getLecturers(),
  ]);

  return (
    <TaskForm
      courses={courses}
      lecturers={lecturers}
      task={task}
    />
  );
}
