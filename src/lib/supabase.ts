import { createClient } from '@supabase/supabase-js';

// Load variables from environment or fallback to user-provided credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ylvpdgfvgfdinyjcsudi.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qe55OBm9DYhy7TM6rURRFg_fL-YfZ6e';
const supabaseServiceRoleKey = (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdnBkZ2Z2Z2ZkaW55amNzdWRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM0ODQ1NywiZXhwIjoyMDk0OTI0NDU3fQ.nrMyobQo2U3xTQgDWCEMngJEoucDL1i5Zl6SKwgwETQ';

// Public Supabase Client (subject to RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
});

// Admin/Superuser Supabase Client (bypasses RLS - ideal for robust global live syncing across multiple client devices)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  }
});
