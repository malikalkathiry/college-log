import { headers } from "next/headers";
import { displayNameFromEmail } from "./user";

/**
 * Nama tampilan user saat ini.
 *
 * Dibaca dari header internal `x-user-email` yang sudah diisi middleware.
 * Dengan begitu layout tidak perlu memanggil Supabase Auth lagi (tidak ada
 * round-trip jaringan tambahan saat berpindah halaman).
 */
export async function getCurrentDisplayName(): Promise<string> {
  const headerStore = await headers();
  const email = headerStore.get("x-user-email");

  if (email) return displayNameFromEmail(email);

  return "Pengguna";
}
