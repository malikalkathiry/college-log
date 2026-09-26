/**
 * Adapter repository.
 *
 * Semua halaman dan server action masih mengimpor repository dengan prefix
 * `mock` (contoh: `mockTaskRepository`). File ini hanya meneruskan ke
 * implementasi Supabase di `supabase.ts` supaya nama import di UI tidak perlu
 * diubah. Menghapus prefix `mock` berarti mengganti semua call site.
 */
import {
  taskRepository,
  checklistRepository,
  scheduleRepository,
  noteRepository,
  courseRepository,
  lecturerRepository,
} from "./supabase";

export type { TaskGroup, TaskWithCourse, ScheduleWithCourse, NoteWithCourse } from "./supabase";

export const mockTaskRepository = taskRepository;

export const mockChecklistRepository = checklistRepository;

export const mockScheduleRepository = scheduleRepository;

export const mockNoteRepository = noteRepository;

export const mockCourseRepository = courseRepository;

export const mockLecturerRepository = lecturerRepository;
