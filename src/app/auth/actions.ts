"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export async function daftar(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  if (!isValidEmail(email)) {
    return { error: "Format email tidak valid" };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok" };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Signup error:", authError);
    if (authError.message.includes("already registered")) {
      return { error: "Email sudah digunakan" };
    }
    return { error: "Gagal membuat akun" };
  }

  if (!authData.user) {
    return { error: "Gagal membuat akun" };
  }

  // Profile row is created automatically by the handle_new_user trigger
  // on auth.users (SECURITY DEFINER), so no manual insert is needed here.
  // The manual insert was failing because the server-side client has no
  // active session after signUp with email confirmation, causing the
  // profiles RLS policy (auth.uid() = id) to reject the insert.

  return { success: true };
}

export async function masuk(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  if (!isValidEmail(email)) {
    return { error: "Format email tidak valid" };
  }

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Login error:", authError);
    return { error: `Login error: ${authError.message}` };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
