"use client";

import { useRouter } from "next/navigation";
import { deleteTask } from "@/app/actions";
import { useState } from "react";

export default function DeleteTaskButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Hapus tugas ini?")) return;

    setDeleting(true);
    const result = await deleteTask(id);
    if (result.success) {
      router.push("/tugas");
      router.refresh();
    }
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="w-full rounded border border-danger px-4 py-3 text-center text-sm font-medium text-danger hover:bg-surface disabled:opacity-50"
    >
      {deleting ? "Menghapus..." : "Hapus Tugas"}
    </button>
  );
}