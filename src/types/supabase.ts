
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

export type Database = GeneratedDatabase;

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type UserRepl = Tables<'user_repls'>;
export type Ticket = Tables<'tickets'>;
export type CodeReview = Tables<'code_reviews'>;
export type Profile = {
  username?: string | null;
  full_name?: string | null;
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  role?: string | null;
  avatar_url?: string;
};

export type ProjectFiles = Record<string, string>;

export interface StackBlitzVM {
  editor: {
    openFile?: (path: string) => Promise<null>;
    setCurrentFile?: (path: string) => Promise<null>;
    setTheme?: (theme: string) => Promise<null>;
    setView?: (view: string) => Promise<null>;
    showSidebar?: (visible?: boolean) => Promise<null>;
    setKeybinding?: (bindings: Record<string, () => Promise<boolean>>) => void;
  };
  getFsSnapshot: () => Promise<Record<string, string>>;
}
