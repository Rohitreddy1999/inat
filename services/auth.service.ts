import { supabase } from '@/lib/supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  return { user: data.user, error }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data.user, error }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession(): Promise<{
  session: Session | null
  error: AuthError | null
}> {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function resetPassword(
  email: string,
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { error }
}

export async function updateEmail(
  email: string,
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({ email })
  return { error }
}

export async function deleteAccount(): Promise<{ error: Error | null }> {
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  })

  return { error: error ?? null }
}
