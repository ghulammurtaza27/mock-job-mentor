
import { Database } from '@/integrations/supabase/types';

export type Ticket = Database['public']['Tables']['tickets']['Row'];

export type TicketStatus = Database['public']['Enums']['ticket_status'];

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string;
  default_branch: string;
}

export interface Issue {
  id: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string }>;
}
