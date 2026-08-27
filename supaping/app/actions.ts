'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createRemoteClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// --- PROJECT ACTIONS ---

export async function getProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', JSON.stringify(error, null, 2))
    return []
  }
  return projects
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) return { success: false, error: 'Session expired. Please log in again.' }

  const name = formData.get('name') as string
  const url = formData.get('url') as string
  const anonKey = formData.get('anonKey') as string

  const { error } = await supabase
    .from('projects')
    .insert([{ name, url, anon_key: anonKey, user_id: user.id }])

  if (error) {
    console.error('[Add Project Error]', error)
    return { success: false, error: 'Could not save the project. Please try again.' }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const url = formData.get('url') as string
  const anonKey = formData.get('anonKey') as string

  const { error } = await supabase
    .from('projects')
    .update({ name, url, anon_key: anonKey })
    .eq('id', id)

  if (error) {
    console.error('[Update Project Error]', error)
    return { success: false, error: 'Could not update the project details.' }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[Delete Project Error]', error)
    return { success: false, error: 'Could not delete the project.' }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function pingProject(id: string) {
  const supabase = await createClient()
  
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('url, anon_key')
    .eq('id', id)
    .single()

  if (fetchError || !project) return { success: false, error: 'Project not found locally.' }

  try {
    const cleanUrl = project.url.trim().replace(/\/$/, '');
    const cleanKey = project.anon_key.trim();
    
    const remoteSupabase = createRemoteClient(cleanUrl, cleanKey, {
      auth: { persistSession: false }
    });
    
    // --- DIAGNOSTIC STEP 1: Can we read the row? ---
    const { data: readData, error: readError } = await remoteSupabase
      .from('keep_alive')
      .select('*')
      .eq('id', 1);

    if (readError) {
      console.error('[Ping Read Error]', readError);
      return { success: false, error: `Target DB Error: ${readError.message}` };
    }
    
    // If readData is empty, either the row is missing OR the SELECT policy is missing
    if (!readData || readData.length === 0) {
      return { success: false, error: 'Row id=1 not found. Ensure the row exists AND a SELECT RLS policy is active.' };
    }

    // --- DIAGNOSTIC STEP 2: Can we update the row? ---
    const randomString = crypto.randomUUID();
    const { data: updatedRow, error: pingError } = await remoteSupabase
      .from('keep_alive')
      .update({ ping: randomString })
      .eq('id', 1)
      .select();

    if (pingError) {
      console.error('[Ping Update Error]', pingError);
      return { success: false, error: `Update Failed: ${pingError.message}` };
    }
    
    // If we can read it, but can't update it, the UPDATE policy is missing
    if (!updatedRow || updatedRow.length === 0) {
      return { success: false, error: 'Update blocked. Ensure the UPDATE RLS policy is active on the target project.' };
    }

    // --- STEP 3: Success, update local timestamp ---
    const { error: updateError } = await supabase
      .from('projects')
      .update({ last_ping_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('[Ping Local Update Error]', updateError);
      return { success: false, error: 'Target pinged successfully, but failed to save timestamp locally.' };
    }

    revalidatePath('/')
    return { success: true }
    
  } catch (err: any) {
    console.error('[Ping Exception]', err)
    return { success: false, error: 'Network error while attempting to connect to target project.' }
  }
}

// --- SETTINGS ACTIONS ---

export async function updatePingFrequency(frequency: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { success: false, error: 'Unauthorized' }

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

  revalidatePath('/')
  return { success: true }
}