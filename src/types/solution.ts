export interface Solution {
  id: string;
  created_at: string;
  ticket_id: string;
  user_id: string;
  changes: FileChange[];
  commit_message: string;
  status: 'pending_review' | 'approved' | 'rejected';
  review_comment?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface FileChange {
  path: string;
  content: string;
  originalContent: string;
} 