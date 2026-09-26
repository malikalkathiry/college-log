"use client";

import { useRouter } from "next/navigation";
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "@/app/actions";
import { useState } from "react";
import type { ChecklistItem } from "@/types";

export default function ChecklistSection({
  taskId,
  items,
}: {
  taskId: string;
  items: ChecklistItem[];
}) {
  const router = useRouter();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", newItemTitle);
    const result = await addChecklistItem(taskId, formData);

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setNewItemTitle("");
      router.refresh();
    }
  };

  const handleToggle = async (itemId: string) => {
    setSubmitting(true);
    await toggleChecklistItem(taskId, itemId);
    setSubmitting(false);
    router.refresh();
  };

  const handleDelete = async (itemId: string) => {
    setSubmitting(true);
    await deleteChecklistItem(taskId, itemId);
    setSubmitting(false);
    router.refresh();
  };

  return (
    <section>
      <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
        Checklist
      </h2>

      <form onSubmit={handleAdd} className="mb-3 flex gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Tambah item..."
          className="flex-1 rounded border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder-foreground-muted outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={submitting || !newItemTitle.trim()}
          className="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          +
        </button>
      </form>

      {error && (
        <p className="mb-2 text-xs text-danger">{error}</p>
      )}

      {items.length === 0 ? (
        <p className="rounded border border-border bg-surface px-3 py-3 text-sm text-foreground-muted">
          Belum ada item checklist.
        </p>
      ) : (
        <ul className="space-y-1">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  disabled={submitting}
                  className="shrink-0 text-foreground-muted hover:text-foreground"
                  aria-label={item.completed ? "Tandai belum selesai" : "Tandai selesai"}
                >
                  {item.completed ? "☑" : "☐"}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    item.completed
                      ? "line-through text-foreground-muted"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={submitting}
                  className="shrink-0 text-xs text-foreground-muted hover:text-danger"
                  aria-label="Hapus item"
                >
                  ×
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}