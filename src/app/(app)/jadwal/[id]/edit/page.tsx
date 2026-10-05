import { notFound } from "next/navigation";
import { mockCourseRepository, mockLecturerRepository, mockScheduleRepository } from "@/lib/repositories/mock";
import JadwalForm from "@/app/(app)/jadwal/JadwalForm";
import DeleteJadwalButton from "@/app/(app)/jadwal/[id]/DeleteJadwalButton";


export default async function EditJadwalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await mockScheduleRepository.getRawById(id);
  if (!entry) {
    notFound();
  }

  const [courses, lecturers] = await Promise.all([
    mockCourseRepository.getCourses(),
    mockLecturerRepository.getLecturers(),
  ]);

  return (
    <JadwalForm
      courses={courses}
      lecturers={lecturers}
      entry={entry}
      footer={<DeleteJadwalButton id={id} />}
    />
  );
}
