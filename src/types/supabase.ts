
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

export type Tables<T extends keyof GeneratedDatabase['public']['Tables']> = 
  GeneratedDatabase['public']['Tables'][T]['Row'];

export type UserRepl = Tables<'user_repls'>;
export type Ticket = Tables<'tickets'>;
export type CodeReview = Tables<'code_reviews'>;
export type Profile = Tables<'profiles'>;

export type ProjectFiles = Record<string, string>;

// Add strongly typed response types
export type SupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
};
