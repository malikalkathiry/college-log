import type {
  Task,
  ChecklistItem,
  Course,
  Lecturer,
  Note,
  ScheduleEntry,
} from "@/types";

export interface TaskRepository {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task>;
  updateTask(id: string, data: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getChecklistItems(taskId: string): Promise<ChecklistItem[]>;
  createChecklistItem(data: Omit<ChecklistItem, "id">): Promise<ChecklistItem>;
  updateChecklistItem(id: string, data: Partial<ChecklistItem>): Promise<ChecklistItem>;
  deleteChecklistItem(id: string): Promise<void>;
}

export interface CourseRepository {
  getCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | null>;
  createCourse(data: Omit<Course, "id">): Promise<Course>;
  updateCourse(id: string, data: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
}

export interface LecturerRepository {
  getLecturers(): Promise<Lecturer[]>;
  getLecturerById(id: string): Promise<Lecturer | null>;
  createLecturer(data: Omit<Lecturer, "id">): Promise<Lecturer>;
  updateLecturer(id: string, data: Partial<Lecturer>): Promise<Lecturer>;
  deleteLecturer(id: string): Promise<void>;
}

export interface NoteRepository {
  getNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(data: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note>;
  updateNote(id: string, data: Partial<Note>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

export interface ScheduleRepository {
  getSchedule(): Promise<ScheduleEntry[]>;
  getScheduleByDay(day: string): Promise<ScheduleEntry[]>;
  createSchedule(data: Omit<ScheduleEntry, "id">): Promise<ScheduleEntry>;
  updateSchedule(id: string, data: Partial<ScheduleEntry>): Promise<ScheduleEntry>;
  deleteSchedule(id: string): Promise<void>;
}
