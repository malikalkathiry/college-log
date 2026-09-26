import { NextResponse } from "next/server";
import { mockTaskRepository } from "@/lib/repositories/mock";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = await mockTaskRepository.getTaskWithCourseInfo(id);

  if (!task) {
    return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(task);
}