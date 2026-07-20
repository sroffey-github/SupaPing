'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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
  
  revalidatePath('/projects')
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
  
  revalidatePath('/projects')
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
  
  revalidatePath('/projects')
  return { success: true }
}

export async function pingProject(id: string) {
  const supabase = await createClient()
  
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('url, anon_key')
    .eq('id', id)
    .single()

  if (fetchError || !project) return { success: false, error: 'Project not found.' }

  try {
    const cleanUrl = project.url.trim().replace(/\/$/, '');
    const pingUrl = `${cleanUrl}/auth/v1/settings`; 
    const cleanKey = project.anon_key.trim();
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'apikey': cleanKey,
        'Authorization': `Bearer ${cleanKey}`
      },
      cache: 'no-store',
    })

    if (!response.ok) {
       // Log the ugly error to the server console for debugging
       const errorText = await response.text();
       console.error(`[Ping Failed] Project ID: ${id} | Status: ${response.status} | Details: ${errorText}`);
       
       // Return a polite error to the UI
       return { success: false, error: 'Target project rejected the connection. Verify URL and key.' }
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({ last_ping_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('[Ping Update Error]', updateError)
      return { success: false, error: 'Ping succeeded, but failed to update the timestamp.' }
    }

    revalidatePath('/projects')
    return { success: true }
  } catch (err: any) {
    console.error('[Ping Exception Error]', err)
    return { success: false, error: 'Network error while attempting to ping.' }
  }
}