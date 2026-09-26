import { NextResponse } from "next/server";
import { mockCourseRepository } from "@/lib/repositories/mock";

export async function GET() {
  const courses = await mockCourseRepository.getCourses();
  return NextResponse.json(courses);
}
