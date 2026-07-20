'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePingFrequency(frequency: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { success: false, error: 'Unauthorized' }

  // Upsert: Insert if it doesn't exist, update if it does
  const { error } = await supabase
    .from('user_settings')
    .upsert({ 
      user_id: user.id, 
      ping_frequency: frequency,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}