import { mockCourseRepository, mockLecturerRepository } from "@/lib/repositories/mock";
import JadwalForm from "@/app/jadwal/JadwalForm";

export const dynamic = "force-dynamic";

export default async function TambahJadwalPage() {
  const [courses, lecturers] = await Promise.all([
    mockCourseRepository.getCourses(),
    mockLecturerRepository.getLecturers(),
  ]);

  return <JadwalForm courses={courses} lecturers={lecturers} />;
}