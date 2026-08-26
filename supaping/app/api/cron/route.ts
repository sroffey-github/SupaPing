import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

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
        
        // Generate a random string to force a database write
        const randomString = crypto.randomUUID();
        
        // Target the keep_alive table, specifically row where id = 1
        const pingUrl = `${cleanUrl}/rest/v1/keep_alive?id=eq.1`;
        
        const response = await fetch(pingUrl, {
          method: 'PATCH',
          headers: {
            'apikey': cleanKey,
            'Authorization': `Bearer ${cleanKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal' // Optimizes bandwidth by not returning the updated row
          },
          body: JSON.stringify({ ping: randomString }),
          cache: 'no-store',
        });

        if (response.ok) {
          // Update the last_ping_at timestamp in SupaPing's database
          await supabase
            .from('projects')
            .update({ last_ping_at: new Date().toISOString() })
            .eq('id', project.id);
            
          pingCount++;
        } else {
          errors.push(`Project ${project.id} returned status: ${response.status}`);
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