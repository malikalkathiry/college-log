import { NextResponse } from "next/server";
import { mockLecturerRepository } from "@/lib/repositories/mock";

export async function GET() {
  const lecturers = await mockLecturerRepository.getLecturers();
  return NextResponse.json(lecturers);
}
