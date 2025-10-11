"use server"

import { redirect } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    return redirect("/auth/login")
  }

  return user
}

type checkAnonResponse = {
  user: User | null
  isAnon: boolean
}

export async function checkIfAnon(): Promise<checkAnonResponse> {
  const supabase = await createClient(); 

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    return {user: null, isAnon: true}
  }
  return {user: user, isAnon:false};
}