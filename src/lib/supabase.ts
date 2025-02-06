import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrdexjselrpcvdyxnbuo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZGV4anNlbHJwY3ZkeXhuYnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxOTQ4MzksImV4cCI6MjAyMjc3MDgzOX0.GYNqz5HnQsaJqq_Qn6vx5TYqoHVPtYVjUBwqQBYOJKE';

export const supabase = createClient(supabaseUrl, supabaseKey);