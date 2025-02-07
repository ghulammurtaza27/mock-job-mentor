
import { Octokit } from '@octokit/rest';

const REPO_OWNER = 'ghulammurtaza27';
const REPO_NAME = 'pingg';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  topics: string[];
  language: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
}

export const githubService = {
  async getRepository(): Promise<Repository> {
    const { data } = await octokit.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    
    return {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      html_url: data.html_url,
      default_branch: data.default_branch,
      topics: data.topics || [],
      language: data.language,
      visibility: data.visibility,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async getIssues(): Promise<Issue[]> {
    const { data } = await octokit.issues.listForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'all',
    });
    
    return data.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      state: issue.state,
      html_url: issue.html_url,
      labels: issue.labels.map(label => ({
        name: typeof label === 'string' ? label : label.name,
        color: typeof label === 'string' ? 'gray' : (label.color || 'gray')
      })),
      created_at: issue.created_at,
      updated_at: issue.updated_at
    }));
  },

  async getRepositoryContent(path: string = ''): Promise<any> {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });
    return data;
  }
}; 
