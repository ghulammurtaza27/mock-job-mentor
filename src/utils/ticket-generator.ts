import type { Repository, Issue } from '@/services/github';
import type { Ticket, TicketCategory } from '@/types/tickets';

interface FileStructure {
  [key: string]: string | FileStructure;
}

export const generateTicketsFromRepo = async (
  repository: Repository,
  issues?: Issue[]
): Promise<Ticket[]> => {
  const tickets: Ticket[] = [];

  // Generate development tickets based on repository structure
  tickets.push({
    id: `dev-${repository.id}`,
    title: `Setup Development Environment for ${repository.name}`,
    description: `Initialize development environment and configure necessary tools for ${repository.name}`,
    category: 'development',
    status: 'open',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    repository_url: repository.html_url,
    branch_name: repository.default_branch,
    technical_requirements: JSON.stringify({
      language: repository.language,
      dependencies: [],
      devDependencies: [],
    }),
  });

  // Generate deployment tickets
  tickets.push({
    id: `deploy-${repository.id}`,
    title: `Deploy ${repository.name} to Production`,
    description: `Setup deployment pipeline and configure hosting for ${repository.name}`,
    category: 'deployment',
    status: 'open',
    priority: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    environment: 'production',
    deployment_steps: JSON.stringify([
      'Setup CI/CD pipeline',
      'Configure environment variables',
      'Setup monitoring and logging',
      'Deploy to staging',
      'Run integration tests',
      'Deploy to production',
    ]),
  });

  // Convert GitHub issues to tickets if available
  if (issues?.length) {
    const issueTickets = issues.map((issue) => ({
      id: `issue-${issue.id}`,
      title: issue.title,
      description: issue.body || '',
      category: determineCategory(issue),
      status: issue.state === 'open' ? 'open' : 'completed',
      priority: determinePriority(issue),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      created_by: 'system',
      technical_requirements: issue.body,
    }));
    tickets.push(...issueTickets);
  }

  return tickets;
};

const determineCategory = (issue: Issue): TicketCategory => {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  
  if (labels.some(l => l.includes('bug') || l.includes('fix'))) {
    return 'development';
  }
  if (labels.some(l => l.includes('design') || l.includes('ui') || l.includes('ux'))) {
    return 'design';
  }
  if (labels.some(l => l.includes('deploy') || l.includes('release'))) {
    return 'deployment';
  }
  if (labels.some(l => l.includes('infra') || l.includes('devops'))) {
    return 'infrastructure';
  }
  
  return 'development';
};

const determinePriority = (issue: Issue) => {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  
  if (labels.some(l => l.includes('critical') || l.includes('urgent'))) {
    return 'critical';
  }
  if (labels.some(l => l.includes('high'))) {
    return 'high';
  }
  if (labels.some(l => l.includes('medium'))) {
    return 'medium';
  }
  return 'low';
}; 