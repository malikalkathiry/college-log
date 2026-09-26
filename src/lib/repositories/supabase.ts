import type { ChecklistItem, Course, Lecturer, Note, ScheduleEntry, Task } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { getDeadlineGroup, selesaiTerlambat } from "@/lib/dates";

export type TaskGroup = "hari_ini" | "besok" | "mendatang" | "terlambat" | "selesai";

export type TaskWithCourse = Task & {
  course_name: string;
  course_code: string;
  lecturer_name: string;
};

export type ScheduleWithCourse = ScheduleEntry & {
  course_name: string;
  course_code: string;
  lecturer_name: string;
};

export type NoteWithCourse = Note & {
  course_name: string;
  course_code: string;
};

type DbCourse = { name: string; code: string; lecturer_id: string | null } | null;
type DbTask = Record<string, unknown> & { courses?: DbCourse };
type DbSchedule = Record<string, unknown> & { courses?: DbCourse };
type DbNote = Record<string, unknown> & { courses?: { name: string; code: string } | null };

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    course_id: (row.course_id as string) ?? "",
    assigned_date: row.assigned_date as string,
    deadline: row.deadline as string,
    context: (row.context as string) ?? "",
    status: row.status as Task["status"],
    completed_date: (row.completed_date as string) || undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    attachment: (row.attachment as string) || undefined,
    link: (row.link as string) || undefined,
  };
}

function rowToLecturer(row: Record<string, unknown>): Lecturer {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    name: row.name as string,
    contact: (row.contact as string) || undefined,
  };
}

function rowToCourse(row: Record<string, unknown>): Course {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    name: row.name as string,
    code: row.code as string,
    credits: row.credits as number,
    lecturer_id: (row.lecturer_id as string) ?? "",
  };
}

function rowToSchedule(row: Record<string, unknown>): ScheduleEntry {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    course_id: (row.course_id as string) ?? "",
    day_of_week: row.day_of_week as ScheduleEntry["day_of_week"],
    start_time: row.start_time as string,
    end_time: row.end_time as string,
    room: row.room as string,
  };
}

function rowToNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    course_id: (row.course_id as string) ?? "",
    title: row.title as string,
    content: (row.content as string) ?? "",
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function rowToChecklistItem(row: Record<string, unknown>): ChecklistItem {
  return {
    id: row.id as string,
    task_id: row.task_id as string,
    title: row.title as string,
    completed: row.completed as boolean,
    order: row.order as number,
  };
}

/** Mengambil user yang sedang login. Semua query otomatis dibatasi oleh RLS. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Sesi tidak valid. Silakan masuk kembali.");
  }

  return { supabase, userId: user.id };
}

/** Mengambil nama dosen berdasarkan daftar lecturer_id. */
async function mapLecturerNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: (string | null | undefined)[]
): Promise<Map<string, string>> {
  const unik = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (unik.length === 0) return new Map();

  const { data } = await supabase.from("lecturers").select("id, name").in("id", unik);
  return new Map((data ?? []).map((l) => [l.id as string, l.name as string]));
}

export const lecturerRepository = {
  async getLecturers(): Promise<Lecturer[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase.from("lecturers").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map(rowToLecturer);
  },

  async getLecturerById(id: string): Promise<Lecturer | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("lecturers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToLecturer(data) : null;
  },

  async createLecturer(data: Omit<Lecturer, "id">): Promise<Lecturer> {
    const { supabase, userId } = await requireUser();
    const { data: row, error } = await supabase
      .from("lecturers")
      .insert({ user_id: userId, name: data.name, contact: data.contact ?? null })
      .select()
      .single();
    if (error) throw error;
    return rowToLecturer(row);
  },

  async updateLecturer(id: string, data: Partial<Lecturer>): Promise<Lecturer> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.contact !== undefined) payload.contact = data.contact ?? null;

    const { data: updated, error } = await supabase
      .from("lecturers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Dosen tidak ditemukan");
    return rowToLecturer(updated);
  },

  async deleteLecturer(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("lecturers").delete().eq("id", id);
    if (error) throw error;
  },
};

export const courseRepository = {
  async getCourses(): Promise<Course[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase.from("courses").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map(rowToCourse);
  },

  async getCourseById(id: string): Promise<Course | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToCourse(data) : null;
  },

  async createCourse(data: Omit<Course, "id">): Promise<Course> {
    const { supabase, userId } = await requireUser();
    const { data: row, error } = await supabase
      .from("courses")
      .insert({
        user_id: userId,
        name: data.name,
        code: data.code,
        credits: data.credits,
        lecturer_id: data.lecturer_id || null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToCourse(row);
  },

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.code !== undefined) payload.code = data.code;
    if (data.credits !== undefined) payload.credits = data.credits;
    if (data.lecturer_id !== undefined) payload.lecturer_id = data.lecturer_id || null;

    const { data: updated, error } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Mata kuliah tidak ditemukan");
    return rowToCourse(updated);
  },

  async deleteCourse(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) throw error;
  },
};

export const taskRepository = {
  async getTasks(): Promise<Task[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToTask);
  },

  async getTaskById(id: string): Promise<Task | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToTask(data) : null;
  },

  async createTask(data: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
    const { supabase, userId } = await requireUser();
    const now = new Date().toISOString();
    const { data: row, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: data.title,
        course_id: data.course_id || null,
        assigned_date: data.assigned_date,
        deadline: data.deadline,
        context: data.context,
        status: data.status,
        completed_date: data.completed_date ?? null,
        attachment: data.attachment ?? null,
        link: data.link ?? null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTask(row);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.title !== undefined) payload.title = data.title;
    if (data.course_id !== undefined) payload.course_id = data.course_id || null;
    if (data.assigned_date !== undefined) payload.assigned_date = data.assigned_date;
    if (data.deadline !== undefined) payload.deadline = data.deadline;
    if (data.context !== undefined) payload.context = data.context;
    if (data.status !== undefined) payload.status = data.status;
    // completed_date dikirim eksplisit (termasuk null) agar bisa dikosongkan
    if (data.completed_date !== undefined) payload.completed_date = data.completed_date ?? null;
    if (data.attachment !== undefined) payload.attachment = data.attachment ?? null;
    if (data.link !== undefined) payload.link = data.link ?? null;

    const { data: updated, error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Tugas tidak ditemukan");
    return rowToTask(updated);
  },

  async deleteTask(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },

  async getTasksWithCourseInfo(): Promise<TaskWithCourse[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .select("*, courses(name, code, lecturer_id)");
    if (error) throw error;

    const rows = (data ?? []) as DbTask[];
    const dosen = await mapLecturerNames(
      supabase,
      rows.map((r) => r.courses?.lecturer_id)
    );

    return rows.map((r) => ({
      ...rowToTask(r),
      course_name: r.courses?.name ?? "—",
      course_code: r.courses?.code ?? "",
      lecturer_name: (r.courses?.lecturer_id && dosen.get(r.courses.lecturer_id)) || "—",
    }));
  },

  async getTaskWithCourseInfo(id: string): Promise<TaskWithCourse | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .select("*, courses(name, code, lecturer_id)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const row = data as DbTask;
    const dosen = await mapLecturerNames(supabase, [row.courses?.lecturer_id]);

    return {
      ...rowToTask(row),
      course_name: row.courses?.name ?? "—",
      course_code: row.courses?.code ?? "",
      lecturer_name: (row.courses?.lecturer_id && dosen.get(row.courses.lecturer_id)) || "—",
    };
  },

  async searchCompletedTasks(filters: {
    query?: string;
    courseId?: string;
    terlambat?: boolean;
  }): Promise<TaskWithCourse[]> {
    const semua = await this.getTasksWithCourseInfo();
    const selesai = semua.filter((t) => t.status === "completed");
    const query = filters.query?.trim().toLowerCase();

    return selesai
      .filter((t) => {
        if (filters.courseId && t.course_id !== filters.courseId) return false;
        if (filters.terlambat && !selesaiTerlambat(t.deadline, t.completed_date)) return false;
        return true;
      })
      .filter((t) => {
        if (!query) return true;
        return [t.title, t.course_name, t.lecturer_name].some((value) =>
          value.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (b.completed_date ?? "").localeCompare(a.completed_date ?? ""));
  },

  async getTasksByGroup(group: TaskGroup): Promise<TaskWithCourse[]> {
    const semua = await this.getTasksWithCourseInfo();

    if (group === "selesai") {
      return semua.filter((t) => t.status === "completed");
    }

    return semua.filter((t) => t.status !== "completed" && getDeadlineGroup(t.deadline) === group);
  },
};

export const checklistRepository = {
  async getByTaskId(taskId: string): Promise<ChecklistItem[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("task_id", taskId)
      .order("order");
    if (error) throw error;
    return (data ?? []).map(rowToChecklistItem);
  },

  async create(data: Omit<ChecklistItem, "id">): Promise<ChecklistItem> {
    const { supabase } = await requireUser();
    const { data: row, error } = await supabase
      .from("checklist_items")
      .insert({
        task_id: data.task_id,
        title: data.title,
        completed: data.completed,
        order: data.order,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToChecklistItem(row);
  },

  async update(id: string, data: Partial<ChecklistItem>): Promise<ChecklistItem> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.completed !== undefined) payload.completed = data.completed;
    if (data.order !== undefined) payload.order = data.order;

    const { data: updated, error } = await supabase
      .from("checklist_items")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Item checklist tidak ditemukan");
    return rowToChecklistItem(updated);
  },

  async toggle(id: string): Promise<ChecklistItem> {
    const { supabase } = await requireUser();
    const { data: item, error: findError } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (findError) throw findError;
    if (!item) throw new Error("Item checklist tidak ditemukan");

    return this.update(id, { completed: !(item.completed as boolean) });
  },

  async delete(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("checklist_items").delete().eq("id", id);
    if (error) throw error;
  },
};

export const scheduleRepository = {
  async getSchedule(): Promise<ScheduleWithCourse[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("schedules")
      .select("*, courses(name, code, lecturer_id)");
    if (error) throw error;

    const rows = (data ?? []) as DbSchedule[];
    const dosen = await mapLecturerNames(
      supabase,
      rows.map((r) => r.courses?.lecturer_id)
    );

    return rows.map((r) => ({
      ...rowToSchedule(r),
      course_name: r.courses?.name ?? "—",
      course_code: r.courses?.code ?? "",
      lecturer_name: (r.courses?.lecturer_id && dosen.get(r.courses.lecturer_id)) || "—",
    }));
  },

  async getScheduleByDay(day: string): Promise<ScheduleWithCourse[]> {
    const semua = await this.getSchedule();
    return semua
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  },

  async getScheduleById(id: string): Promise<ScheduleWithCourse | null> {
    const semua = await this.getSchedule();
    return semua.find((s) => s.id === id) ?? null;
  },

  async getRawById(id: string): Promise<ScheduleEntry | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToSchedule(data) : null;
  },

  async createSchedule(data: Omit<ScheduleEntry, "id">): Promise<ScheduleEntry> {
    const { supabase, userId } = await requireUser();
    const { data: row, error } = await supabase
      .from("schedules")
      .insert({
        user_id: userId,
        course_id: data.course_id || null,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        room: data.room,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToSchedule(row);
  },

  async updateSchedule(id: string, data: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = {};
    if (data.course_id !== undefined) payload.course_id = data.course_id || null;
    if (data.day_of_week !== undefined) payload.day_of_week = data.day_of_week;
    if (data.start_time !== undefined) payload.start_time = data.start_time;
    if (data.end_time !== undefined) payload.end_time = data.end_time;
    if (data.room !== undefined) payload.room = data.room;

    const { data: updated, error } = await supabase
      .from("schedules")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Jadwal tidak ditemukan");
    return rowToSchedule(updated);
  },

  async deleteSchedule(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (error) throw error;
  },
};

export const noteRepository = {
  async getNotes(): Promise<NoteWithCourse[]> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("notes")
      .select("*, courses(name, code)")
      .order("updated_at", { ascending: false });
    if (error) throw error;

    return ((data ?? []) as DbNote[]).map((r) => ({
      ...rowToNote(r),
      course_name: r.courses?.name ?? "—",
      course_code: r.courses?.code ?? "",
    }));
  },

  async getNoteById(id: string): Promise<NoteWithCourse | null> {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("notes")
      .select("*, courses(name, code)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const row = data as DbNote;
    return {
      ...rowToNote(row),
      course_name: row.courses?.name ?? "—",
      course_code: row.courses?.code ?? "",
    };
  },

  async createNote(data: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
    const { supabase, userId } = await requireUser();
    const now = new Date().toISOString();
    const { data: row, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        course_id: data.course_id || null,
        title: data.title,
        content: data.content,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToNote(row);
  },

  async updateNote(id: string, data: Partial<Note>): Promise<Note> {
    const { supabase } = await requireUser();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.course_id !== undefined) payload.course_id = data.course_id || null;
    if (data.title !== undefined) payload.title = data.title;
    if (data.content !== undefined) payload.content = data.content;

    const { data: updated, error } = await supabase
      .from("notes")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("Catatan tidak ditemukan");
    return rowToNote(updated);
  },

  async deleteNote(id: string): Promise<void> {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
  },
};
