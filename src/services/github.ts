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
  description: string;
  html_url: string;
  default_branch: string;
  topics: string[];
  language: string;
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
    return data;
  },

  async getIssues(): Promise<Issue[]> {
    const { data } = await octokit.issues.listForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'all',
    });
    return data;
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