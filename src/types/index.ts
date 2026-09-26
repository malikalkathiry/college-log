export type TaskStatus = "todo" | "in_progress" | "completed";

export type DayOfWeek =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export interface User {
  id: string;
  created_at: string;
}

export interface Lecturer {
  id: string;
  user_id: string;
  name: string;
  contact?: string;
}

export interface Course {
  id: string;
  user_id: string;
  name: string;
  code: string;
  credits: number;
  lecturer_id: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  course_id: string;
  assigned_date: string;
  deadline: string;
  context: string;
  status: TaskStatus;
  completed_date?: string;
  created_at: string;
  updated_at: string;
  attachment?: string;
  link?: string;
}

export interface ChecklistItem {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Note {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleEntry {
  id: string;
  user_id: string;
  course_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string;
}
