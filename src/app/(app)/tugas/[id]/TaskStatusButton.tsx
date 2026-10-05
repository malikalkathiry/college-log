"use client";

import { useRouter } from "next/navigation";
import { changeTaskStatus } from "@/app/actions";
import { useState } from "react";
import type { TaskStatus } from "@/types";

const statuses: TaskStatus[] = ["todo", "in_progress", "completed"];

const labels: Record<TaskStatus, string> = {
  todo: "Belum Dikerjakan",
  in_progress: "Sedang Dikerjakan",
  completed: "Selesai",
};

export default function TaskStatusButton({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: TaskStatus;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = async (newStatus: TaskStatus) => {
    if (submitting) return;

    setSubmitting(true);
    await changeTaskStatus(taskId, newStatus);
    setSubmitting(false);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {statuses.map((status) => {
        const isCurrent = status === currentStatus;
        return (
          <button
            key={status}
            onClick={() => handleChange(status)}
            disabled={isCurrent || submitting}
            className={`flex-1 rounded border border-border px-2 py-2 text-xs font-medium ${
              isCurrent
                ? "bg-surface text-foreground-muted"
                : "text-foreground hover:bg-surface"
            }`}
          >
            {labels[status]}
          </button>
        );
      })}
    </div>
  );
}