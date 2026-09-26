"use client";

import { useRouter } from "next/navigation";
import { deleteNote } from "@/app/actions";
import { useState } from "react";

export default function DeleteNoteButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Hapus catatan ini?")) return;

    setDeleting(true);
    const result = await deleteNote(id);
    if (result.success) {
      router.push("/catatan");
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
      {deleting ? "Menghapus..." : "Hapus Catatan"}
    </button>
  );
}
