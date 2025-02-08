import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

export const checkDatabaseConnection = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth configuration error:', {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      return false;
    }

    console.log('Database connection successful:', {
      authStatus: 'configured',
      session: authData
    });

    return true;
  } catch (error) {
    console.error('Unexpected error during database check:', error);
    return false;
  }
};

// Run the check when the file loads
checkDatabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Failed to establish database connection. Please check your Supabase configuration.');
  } else {
    console.log('Successfully connected to Supabase');
  }
});
