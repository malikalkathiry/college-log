/**
 * Ubah email internal (identitas Supabase Auth) menjadi nama tampilan
 * yang ramah. Email penuh tidak pernah ditampilkan di UI.
 */
export function displayNameFromEmail(email: string | null | undefined): string {
  if (!email) return "Pengguna";

  const local = email.split("@")[0] ?? "";
  if (!local) return "Pengguna";

  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return words.join(" ") || "Pengguna";
}
