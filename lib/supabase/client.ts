import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://fowtelstkvcokatlrybk.supabase.co',
    'sb_publishable_PzcO4nu3-VHL8TdF5_ErWg_SP9sH2UF'
  )
}
