import { notFound } from "next/navigation";
import Link from "next/link";
import { mockTaskRepository, mockChecklistRepository } from "@/lib/repositories/mock";
import { formatTanggal, formatTanggalJam, getStatusLabel, getDeadlineLabel } from "@/lib/dates";
import PageHeader from "@/components/PageHeader";
import DeleteTaskButton from "./DeleteTaskButton";
import TaskStatusButton from "./TaskStatusButton";
import ChecklistSection from "./ChecklistSection";


export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await mockTaskRepository.getTaskWithCourseInfo(id);

  if (!task) {
    notFound();
  }

  const checklist = await mockChecklistRepository.getByTaskId(id);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={task.title} backHref="/tugas" />

      <div className="px-4 py-6">
        <div className="space-y-5">
          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Mata Kuliah</h2>
            <p className="text-sm text-foreground">{task.course_name}</p>
            <p className="text-xs text-foreground-muted">{task.course_code}</p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Dosen</h2>
            <p className="text-sm text-foreground">{task.lecturer_name}</p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Tanggal</h2>
            <div className="space-y-1 rounded border border-border bg-surface px-3 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Diberikan</span>
                <span className="text-foreground">{formatTanggal(task.assigned_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Deadline</span>
                <span className="text-foreground">
                  {formatTanggalJam(task.deadline)} · {getDeadlineLabel(task.deadline)}
                </span>
              </div>
              {task.completed_date && (
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Selesai</span>
                  <span className="text-foreground">{formatTanggal(task.completed_date)}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Konteks</h2>
            <p className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground whitespace-pre-wrap">
              {task.context}
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">Status</h2>
            <div className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground">
              {getStatusLabel(task.status)}
            </div>
            <div className="mt-3">
              <TaskStatusButton taskId={task.id} currentStatus={task.status} />
            </div>
          </section>

          <ChecklistSection taskId={task.id} items={checklist} />
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href={`/tugas/${task.id}/edit`}
            className="block w-full rounded border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Edit Tugas
          </Link>
          <DeleteTaskButton id={task.id} />
        </div>
      </div>
    </div>
  );
}
