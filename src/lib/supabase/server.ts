import { cache } from "react";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

type AuthedClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Satu client + satu panggilan auth.getUser() per request.
 *
 * `cache()` dari React membuat hasil ini dipakai bersama selama satu render
 * request, sehingga beberapa repository call di halaman yang sama tidak lagi
 * menembak `auth.getUser()` berulang kali (ini penyebab utama navigasi lambat).
 */
export const getAuthedClient = cache(
  async (): Promise<{ supabase: AuthedClient; userId: string }> => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Sesi tidak valid. Silakan masuk kembali.");
    }

    return { supabase, userId: user.id };
  }
);
