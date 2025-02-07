export type Database = {
  public: {
    Tables: {
      user_repls: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          stackblitz_id?: string;
          current_ticket_id?: string;
          progress: Record<string, any>;
          created_at: string;
          last_accessed: string;
        };
        Insert: {
          user_id: string;
          template_id: string;
          stackblitz_id?: string;
          current_ticket_id?: string;
          progress?: Record<string, any>;
        };
        Update: {
          stackblitz_id?: string;
          current_ticket_id?: string;
          progress?: Record<string, any>;
          last_accessed?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          status: string;
          assigned_to: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          category: string;
          assigned_to: string;
          status?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          status?: string;
          assigned_to?: string;
        };
      };
      code_reviews: {
        Row: {
          id: string;
          ticket_id: string;
          changes: Record<string, string>;
          status: 'pending' | 'completed';
        }
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          username: string;
          full_name?: string;
          role?: string;
        };
        Update: {
          username?: string;
          full_name?: string;
          role?: string;
        };
      }
    };
  };
}; 