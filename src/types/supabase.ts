
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

export type Database = GeneratedDatabase;

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type UserRepl = Tables<'user_repls'>;
export type Ticket = Tables<'tickets'>;
export type CodeReview = Tables<'code_reviews'>;
export type Profile = Tables<'profiles'> & {
  avatar_url?: string;
};

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

// Add VM types for StackBlitz
export type StackBlitzVM = {
  editor: {
    setKeybinding?: (bindings: Record<string, () => Promise<boolean>>) => void;
  };
  getFsSnapshot: () => Promise<Record<string, string>>;
};
