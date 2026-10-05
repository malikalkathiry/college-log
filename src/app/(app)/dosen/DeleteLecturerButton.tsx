"use client";

import { useRouter } from "next/navigation";
import { deleteLecturer } from "@/app/actions";
import { useState } from "react";

export default function DeleteLecturerButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Hapus dosen ini?")) return;

    setDeleting(true);
    const result = await deleteLecturer(id);
    if (result.success) {
      router.refresh();
    }
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="shrink-0 px-2 py-1 text-xs text-foreground-muted hover:text-danger"
      aria-label="Hapus dosen"
    >
      Hapus
    </button>
  );
}
