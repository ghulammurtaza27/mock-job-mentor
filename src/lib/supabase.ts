import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otevpwalhbogsiegvpnc.supabase.co';
// Get this from your project's API settings
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZXZwd2FsaGJvZ3NpZWd2cG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MjQ2MjUsImV4cCI6MjA1NDQwMDYyNX0.xgmt1g0F3DYEiVa1N0gdbWw85eJWNIoUiXm2boKZhVc';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
);

export const checkDatabaseConnection = async () => {
  try {
    // First check auth configuration
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