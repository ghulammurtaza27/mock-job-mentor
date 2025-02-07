
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'in_review' | 'completed';
  difficulty: string;
  estimated_time: number;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  started_at?: string;
}
