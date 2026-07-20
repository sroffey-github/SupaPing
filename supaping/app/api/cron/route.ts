import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// Helper function to check if a project needs a ping based on frequency
function needsPing(lastPingAt: string | null, frequency: string): boolean {
  if (!lastPingAt) return true; // Never pinged before

  const lastPingDate = new Date(lastPingAt);
  const now = new Date();
  const diffInDays = (now.getTime() - lastPingDate.getTime()) / (1000 * 3600 * 24);

  switch (frequency) {
    case '3_days': return diffInDays >= 3;
    case '5_days': return diffInDays >= 5;
    case 'daily':
    default: return diffInDays >= 1;
  }
}

export async function GET(request: Request) {
  // 1. Secure the route: Only allow requests with the correct secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 2. Fetch all projects and all user settings
  const { data: projects, error: projectsError } = await supabase.from('projects').select('*');
  const { data: settings, error: settingsError } = await supabase.from('user_settings').select('*');

  if (projectsError || settingsError) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  // Map settings by user_id for quick lookup
  const settingsMap = new Map(settings?.map((s) => [s.user_id, s.ping_frequency]));

  let pingCount = 0;
  const errors: string[] = [];

  // 3. Loop through all projects and ping them if necessary
  for (const project of projects || []) {
    const frequency = settingsMap.get(project.user_id) || 'daily'; // Default to daily if no settings found

    if (needsPing(project.last_ping_at, frequency)) {
      try {
        // 1. Clean the URL and Key just like we did in the manual action
        const cleanUrl = project.url.trim().replace(/\/$/, '');
        const cleanKey = project.anon_key.trim();
        
        // 2. Point to the Auth settings endpoint
        const pingUrl = `${cleanUrl}/auth/v1/settings`;
        
        const response = await fetch(pingUrl, {
          method: 'GET',
          headers: {
            'apikey': cleanKey,
            'Authorization': `Bearer ${cleanKey}`
          },
          cache: 'no-store',
        });

        if (response.ok) {
          // Update the last_ping_at timestamp in our database
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