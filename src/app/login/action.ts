'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabaseServer'

interface LoginFormData {
  email: string;
  password: string;
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data: LoginFormData = {
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  }

  const { error, data: { session } } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  if (session) {
    redirect('/dashboard')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
