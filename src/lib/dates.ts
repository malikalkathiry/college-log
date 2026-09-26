import type { DayOfWeek } from "@/types";

const bulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const HARI: DayOfWeek[] = [
  "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu",
];

export function isHari(value: string): value is DayOfWeek {
  return HARI.includes(value as DayOfWeek);
}

export function formatJamSingkat(time: string): string {
  return time.slice(0, 5);
}

export const JAM_DEFAULT = "23:59";

export type DeadlineGroup = "terlambat" | "hari_ini" | "besok" | "mendatang";

function hasJam(nilai: string): boolean {
  return /T\d{2}:\d{2}/.test(nilai);
}

export function formatTanggal(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = bulan[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatJam(dateStr: string): string {
  const date = new Date(dateStr);
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");
  return `${jam}.${menit}`;
}

export function formatTanggalJam(dateStr: string): string {
  if (!hasJam(dateStr)) return formatTanggal(dateStr);
  return `${formatTanggal(dateStr)} · ${formatJam(dateStr)}`;
}

export function gabungDeadline(tanggal: string, jam: string): string {
  const tanggalValid = (tanggal ?? "").trim();
  if (!tanggalValid) return "";

  const jamValid = (jam ?? "").trim();
  const jamFinal = /^\d{2}:\d{2}$/.test(jamValid) ? jamValid : JAM_DEFAULT;

  return `${tanggalValid}T${jamFinal}`;
}

export function pisahkanDeadline(deadline: string): { tanggal: string; jam: string } {
  const nilai = (deadline ?? "").trim();
  if (!nilai) return { tanggal: "", jam: JAM_DEFAULT };

  const [tanggal, jam] = nilai.split("T");
  return {
    tanggal: tanggal ?? "",
    jam: hasJam(nilai) ? jam.slice(0, 5) : JAM_DEFAULT,
  };
}

export function getDeadlineGroup(deadline: string, now: Date = new Date()): DeadlineGroup {
  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return "mendatang";

  const deadlineTime = deadlineDate.getTime();

  if (deadlineTime < now.getTime()) return "terlambat";

  const besok = new Date(now);
  besok.setHours(0, 0, 0, 0);
  besok.setDate(besok.getDate() + 1);

  const lusa = new Date(besok);
  lusa.setDate(besok.getDate() + 1);

  if (deadlineTime >= lusa.getTime()) return "mendatang";
  if (deadlineTime >= besok.getTime()) return "besok";
  return "hari_ini";
}

export function getDeadlineLabel(deadline: string, now?: Date): string {
  switch (getDeadlineGroup(deadline, now)) {
    case "terlambat":
      return "Terlambat";
    case "hari_ini":
      return "Hari Ini";
    case "besok":
      return "Besok";
    case "mendatang":
      return "Mendatang";
  }
}

export function selesaiTerlambat(deadline: string, completedDate?: string): boolean {
  if (!completedDate) return false;

  const batas = new Date(deadline).getTime();
  const selesai = new Date(completedDate).getTime();
  if (Number.isNaN(batas) || Number.isNaN(selesai)) return false;

  return selesai > batas;
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "todo": return "Belum Dikerjakan";
    case "in_progress": return "Sedang Dikerjakan";
    case "completed": return "Selesai";
    default: return status;
  }
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
