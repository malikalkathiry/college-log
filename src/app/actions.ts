"use server";

import { revalidatePath } from "next/cache";
import { mockCourseRepository, mockLecturerRepository, mockTaskRepository, mockChecklistRepository, mockScheduleRepository, mockNoteRepository } from "@/lib/repositories/mock";
import { gabungDeadline, isHari } from "@/lib/dates";

const userId = "user1";

export async function createLecturer(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = (formData.get("contact") as string) || undefined;

  if (!name?.trim()) {
    return { error: "Nama dosen wajib diisi" };
  }

  await mockLecturerRepository.createLecturer({
    user_id: userId,
    name: name.trim(),
    contact,
  });

  revalidatePath("/dosen");
  return { success: true };
}

export async function updateLecturer(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const contact = (formData.get("contact") as string) || undefined;

  if (!name?.trim()) {
    return { error: "Nama dosen wajib diisi" };
  }

  try {
    await mockLecturerRepository.updateLecturer(id, {
      name: name.trim(),
      contact,
    });
  } catch {
    return { error: "Dosen tidak ditemukan" };
  }

  revalidatePath("/dosen");
  revalidatePath(`/dosen/${id}`);
  revalidatePath(`/dosen/${id}/edit`);
  return { success: true };
}

export async function deleteLecturer(id: string) {
  await mockLecturerRepository.deleteLecturer(id);
  revalidatePath("/dosen");
  return { success: true };
}

export async function createCourse(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const credits = parseInt(formData.get("credits") as string, 10);
  const lecturerId = formData.get("lecturer_id") as string;

  if (!name?.trim() || !code?.trim()) {
    return { error: "Nama dan kode mata kuliah wajib diisi" };
  }

  if (isNaN(credits) || credits < 1) {
    return { error: "Jumlah SKS tidak valid" };
  }

  await mockCourseRepository.createCourse({
    user_id: userId,
    name: name.trim(),
    code: code.trim(),
    credits,
    lecturer_id: lecturerId,
  });

  revalidatePath("/mata-kuliah");
  return { success: true };
}

export async function updateCourse(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const credits = parseInt(formData.get("credits") as string, 10);
  const lecturerId = formData.get("lecturer_id") as string;

  if (!name?.trim() || !code?.trim()) {
    return { error: "Nama dan kode mata kuliah wajib diisi" };
  }

  if (isNaN(credits) || credits < 1) {
    return { error: "Jumlah SKS tidak valid" };
  }

  try {
    await mockCourseRepository.updateCourse(id, {
      name: name.trim(),
      code: code.trim(),
      credits,
      lecturer_id: lecturerId,
    });
  } catch {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  revalidatePath("/mata-kuliah");
  revalidatePath(`/mata-kuliah/${id}`);
  revalidatePath(`/mata-kuliah/${id}/edit`);
  return { success: true };
}

export async function deleteCourse(id: string) {
  await mockCourseRepository.deleteCourse(id);
  revalidatePath("/mata-kuliah");
  return { success: true };
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("course_id") as string;
  const assignedDate = formData.get("assigned_date") as string;
  const tanggalDeadline = (formData.get("deadline") as string) ?? "";
  const jamDeadline = (formData.get("deadline_jam") as string) ?? "";
  const deadline = gabungDeadline(tanggalDeadline, jamDeadline);
  const context = formData.get("context") as string;
  const link = (formData.get("link") as string) || undefined;

  if (!title?.trim() || !courseId || !assignedDate || !tanggalDeadline || !context?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  if (new Date(deadline) < new Date(assignedDate)) {
    return { error: "Deadline tidak boleh sebelum tanggal diberikan" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  await mockTaskRepository.createTask({
    user_id: userId,
    title: title.trim(),
    course_id: courseId,
    assigned_date: assignedDate,
    deadline,
    context: context.trim(),
    status: "todo",
    link,
  });

  revalidatePath("/tugas");
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("course_id") as string;
  const assignedDate = formData.get("assigned_date") as string;
  const tanggalDeadline = (formData.get("deadline") as string) ?? "";
  const jamDeadline = (formData.get("deadline_jam") as string) ?? "";
  const deadline = gabungDeadline(tanggalDeadline, jamDeadline);
  const context = formData.get("context") as string;
  const link = (formData.get("link") as string) || undefined;

  if (!title?.trim() || !courseId || !assignedDate || !tanggalDeadline || !context?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  if (new Date(deadline) < new Date(assignedDate)) {
    return { error: "Deadline tidak boleh sebelum tanggal diberikan" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  try {
    await mockTaskRepository.updateTask(id, {
      title: title.trim(),
      course_id: courseId,
      assigned_date: assignedDate,
      deadline,
      context: context.trim(),
      link,
    });
  } catch {
    return { error: "Tugas tidak ditemukan" };
  }

  revalidatePath("/tugas");
  revalidatePath(`/tugas/${id}`);
  return { success: true };
}

export async function deleteTask(id: string) {
  await mockTaskRepository.deleteTask(id);
  revalidatePath("/tugas");
  return { success: true };
}

export async function changeTaskStatus(id: string, status: "todo" | "in_progress" | "completed") {
  try {
    await mockTaskRepository.updateTask(id, {
      status,
      completed_date: status === "completed" ? new Date().toISOString() : undefined,
    });
  } catch {
    return { error: "Tugas tidak ditemukan" };
  }

  revalidatePath("/tugas");
  revalidatePath(`/tugas/${id}`);
  return { success: true };
}

export async function addChecklistItem(taskId: string, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) {
    return { error: "Judul item checklist tidak boleh kosong" };
  }

  const existing = await mockChecklistRepository.getByTaskId(taskId);
  await mockChecklistRepository.create({
    task_id: taskId,
    title: title.trim(),
    completed: false,
    order: existing.length + 1,
  });

  revalidatePath(`/tugas/${taskId}`);
  return { success: true };
}

export async function toggleChecklistItem(taskId: string, itemId: string) {
  try {
    await mockChecklistRepository.toggle(itemId);
  } catch {
    return { error: "Item checklist tidak ditemukan" };
  }

  revalidatePath(`/tugas/${taskId}`);
  return { success: true };
}

export async function deleteChecklistItem(taskId: string, itemId: string) {
  await mockChecklistRepository.delete(itemId);
  revalidatePath(`/tugas/${taskId}`);
  return { success: true };
}

export async function createSchedule(formData: FormData) {
  const courseId = formData.get("course_id") as string;
  const dayOfWeek = formData.get("day_of_week") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const room = formData.get("room") as string;

  if (!courseId || !dayOfWeek || !startTime || !endTime || !room?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  if (!isHari(dayOfWeek)) {
    return { error: "Hari tidak valid" };
  }

  if (startTime >= endTime) {
    return { error: "Jam selesai harus setelah jam mulai" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  await mockScheduleRepository.createSchedule({
    user_id: userId,
    course_id: courseId,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    room: room.trim(),
  });

  revalidatePath("/jadwal");
  return { success: true };
}

export async function updateSchedule(id: string, formData: FormData) {
  const courseId = formData.get("course_id") as string;
  const dayOfWeek = formData.get("day_of_week") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const room = formData.get("room") as string;

  if (!courseId || !dayOfWeek || !startTime || !endTime || !room?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  if (!isHari(dayOfWeek)) {
    return { error: "Hari tidak valid" };
  }

  if (startTime >= endTime) {
    return { error: "Jam selesai harus setelah jam mulai" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  try {
    await mockScheduleRepository.updateSchedule(id, {
      course_id: courseId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      room: room.trim(),
    });
  } catch {
    return { error: "Jadwal tidak ditemukan" };
  }

  revalidatePath("/jadwal");
  revalidatePath(`/jadwal/${id}/edit`);
  return { success: true };
}

export async function deleteSchedule(id: string) {
  await mockScheduleRepository.deleteSchedule(id);
  revalidatePath("/jadwal");
  return { success: true };
}

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("course_id") as string;
  const content = formData.get("content") as string;

  if (!title?.trim() || !courseId || !content?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  await mockNoteRepository.createNote({
    user_id: userId,
    course_id: courseId,
    title: title.trim(),
    content: content.trim(),
  });

  revalidatePath("/catatan");
  return { success: true };
}

export async function updateNote(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("course_id") as string;
  const content = formData.get("content") as string;

  if (!title?.trim() || !courseId || !content?.trim()) {
    return { error: "Semua field wajib diisi" };
  }

  const course = await mockCourseRepository.getCourseById(courseId);
  if (!course) {
    return { error: "Mata kuliah tidak ditemukan" };
  }

  try {
    await mockNoteRepository.updateNote(id, {
      course_id: courseId,
      title: title.trim(),
      content: content.trim(),
    });
  } catch {
    return { error: "Catatan tidak ditemukan" };
  }

  revalidatePath("/catatan");
  revalidatePath(`/catatan/${id}`);
  revalidatePath(`/catatan/${id}/edit`);
  return { success: true };
}

export async function deleteNote(id: string) {
  await mockNoteRepository.deleteNote(id);
  revalidatePath("/catatan");
  return { success: true };
}
