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

/**
 * Ensures the 'business-assets' bucket exists
 */
export const ensureBucketExists = async () => {
  try {
    await supabaseAdmin.storage.createBucket('business-assets', {
      public: true,
    });
  } catch (e) {
    // Ignore error if bucket already exists
  }
};

/**
 * Uploads a Base64 string or File/Blob to the public 'business-assets' bucket and returns its public URL
 */
export const uploadToStorage = async (
  fileOrBase64: File | Blob | string,
  fileName: string
): Promise<string> => {
  try {
    await ensureBucketExists();

    let body: any = fileOrBase64;
    let contentType = 'application/octet-stream';

    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      const parts = fileOrBase64.split(';base64,');
      if (parts.length >= 2) {
        contentType = parts[0].split(':')[1].split(';')[0] || contentType;
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        body = new Blob([uInt8Array], { type: contentType });
      } else {
        return fileOrBase64;
      }
    } else if (fileOrBase64 instanceof File) {
      contentType = fileOrBase64.type;
    } else if (fileOrBase64 instanceof Blob) {
      contentType = fileOrBase64.type;
    } else {
      return fileOrBase64 as any;
    }

    const cleanedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');

    const { data, error } = await supabaseAdmin.storage
      .from('business-assets')
      .upload(cleanedFileName, body, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('business-assets')
      .getPublicUrl(cleanedFileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload asset to Supabase Storage:', err);
    if (typeof fileOrBase64 === 'string') {
      return fileOrBase64;
    }
    throw err;
  }
};

