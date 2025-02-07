
import type { Repository, Issue } from '@/types/tickets';
import type { Ticket } from '@/types/supabase';

interface FileStructure {
  [key: string]: string | FileStructure;
}

export const generateTicketsFromRepo = async (
  repository: Repository,
  issues?: Issue[]
): Promise<Partial<Ticket>[]> => {
  const tickets: Partial<Ticket>[] = [];

  // Generate development tickets based on repository structure
  tickets.push({
    id: `dev-${repository.id}`,
    title: `Setup Development Environment for ${repository.name}`,
    description: `Initialize development environment and configure necessary tools for ${repository.name}`,
    status: 'open',
    difficulty: 'Medium',
    estimated_time: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Convert GitHub issues to tickets if available
  if (issues?.length) {
    const issueTickets = issues.map((issue): Partial<Ticket> => ({
      id: `issue-${issue.id}`,
      title: issue.title,
      description: issue.body || '',
      status: 'open',
      difficulty: determineDifficulty(issue),
      estimated_time: estimateTime(issue),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));
    tickets.push(...issueTickets);
  }

  return tickets;
};

const determineDifficulty = (issue: Issue): string => {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  
  if (labels.some(l => l.includes('hard') || l.includes('complex'))) {
    return 'Hard';
  }
  if (labels.some(l => l.includes('medium'))) {
    return 'Medium';
  }
  return 'Easy';
}; 

const estimateTime = (issue: Issue): number => {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  
  if (labels.some(l => l.includes('large'))) {
    return 240; // 4 hours
  }
  if (labels.some(l => l.includes('medium'))) {
    return 120; // 2 hours
  }
  return 60; // 1 hour
};

