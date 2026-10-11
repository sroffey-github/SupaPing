import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient as createRemoteClient } from '@supabase/supabase-js';

// Helper function to check if a project needs a ping based on frequency
function needsPing(lastPingAt: string | null, frequency: string): boolean {
  if (!lastPingAt) return true;

  const lastPingDate = new Date(lastPingAt);
  const now = new Date();
  
  const diffInHours = (now.getTime() - lastPingDate.getTime()) / (1000 * 3600);

  switch (frequency) {
    case '3_days': return diffInHours >= (3 * 24) - 1; // 71 hours
    case '5_days': return diffInHours >= (5 * 24) - 1; // 119 hours
    case 'daily':
    default: return diffInHours >= 23; // 23 hours
  }
}

export async function GET(request: Request) {
  // Secure the route
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch all projects and all user settings
  const { data: projects, error: projectsError } = await supabase.from('projects').select('*');
  const { data: settings, error: settingsError } = await supabase.from('user_settings').select('*');

  if (projectsError || settingsError) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  // Map settings by user_id for quick lookup
  const settingsMap = new Map(settings?.map((s) => [s.user_id, s.ping_frequency]));

  let pingCount = 0;
  const errors: string[] = [];

  // Loop through all projects and ping them if necessary
  for (const project of projects || []) {
    const frequency = settingsMap.get(project.user_id) || 'daily';

    if (needsPing(project.last_ping_at, frequency)) {
      try {
        const cleanUrl = project.url.trim().replace(/\/$/, '');
        const cleanKey = project.anon_key.trim();
        
        // 2. Initialize a temporary Supabase client for the target project
        const remoteSupabase = createRemoteClient(cleanUrl, cleanKey, {
          auth: { persistSession: false } // Prevent it from storing a session
        });
        
        // Generate a random string to force a database write
        const randomString = crypto.randomUUID();
        
        // 3. Perform the update using the anon client and force it to return the row
        const { data: updatedRow, error: pingError } = await remoteSupabase
          .from('keep_alive')
          .update({ ping: randomString })
          .eq('id', 1)
          .select();

        // 4. Catch silent failures (RLS blocked it, or row missing)
        if (pingError || !updatedRow || updatedRow.length === 0) {
          const errMsg = pingError ? pingError.message : 'Target project rejected update (RLS) or id=1 missing';
          errors.push(`Project ${project.id} failed: ${errMsg}`);
          continue; // Skip updating the timestamp locally and move to the next project
        }

        // 5. Update the last_ping_at timestamp in SupaPing's database
        const { error: updateError } = await supabase
          .from('projects')
          .update({ last_ping_at: new Date().toISOString() })
          .eq('id', project.id);
          
        if (updateError) {
          errors.push(`Project ${project.id} pinged, but local timestamp update failed: ${updateError.message}`);
        } else {
          pingCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to ping project ${project.id}: ${err.message}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: `Cron job finished. Pinged ${pingCount} projects.`,
    errors: errors.length > 0 ? errors : undefined,
  });
}