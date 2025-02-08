import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

export interface Profile {
  id: uuid;
  name: string | null;
  email: string | null;
  updated_at: string | null;
}

// Extend the generated database types with our custom types
export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      user_repl_files: {
        Row: {
          id: string;
          user_repl_id: string;
          file_path: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_repl_id: string;
          file_path: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_repl_id?: string;
          file_path?: string;
          content?: string;
          updated_at?: string;
        };
      };
      // ... other tables
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type UserRepl = Tables<'user_repls'>;
export type Ticket = Tables<'tickets'>;
export type CodeReview = Tables<'code_reviews'>;

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

export type Tables = {
  profiles: Profile;
  // Add other tables here
};
