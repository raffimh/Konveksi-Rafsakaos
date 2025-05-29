import { User } from "@supabase/supabase-js"

export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url: string
  role: "admin" | "customer"
}

export interface UserWithProfile extends User {
  display_name: string
  avatar_url: string
  role: "admin" | "customer"
}