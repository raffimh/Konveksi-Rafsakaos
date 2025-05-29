import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type Database } from "@/lib/types/supabase";

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

export async function getSession() {
  const supabase = await createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

export async function getUserProfile() {
  const supabase = await createClient();
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return profile;
}

export async function requireAuth(role?: ProfileType["role"]) {
  const session = await getSession();
  const profile = await getUserProfile();

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_BASE_URL));
  }

  if (role && (!profile || profile.role !== role)) {
    return NextResponse.redirect(new URL("/unauthorized", process.env.NEXT_PUBLIC_BASE_URL));
  }

  return null;
}