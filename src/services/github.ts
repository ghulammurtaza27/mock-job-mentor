import { Octokit } from '@octokit/rest';
import { supabase } from '@/lib/supabase';

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

export interface GitHubConfig {
  orgName: string;
  repoPrefix: string;
  defaultBranch: string;
}

const config: GitHubConfig = {
  orgName: 'mock-job-mentor',
  repoPrefix: 'project-',
  defaultBranch: 'main'
};

export class GitHubService {
  private octokit: Octokit;
  
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async createProjectRepo(userId: string, projectName: string) {
    try {
      const repoName = `${config.repoPrefix}${projectName}`;
      
      const response = await this.octokit.repos.createInOrg({
        org: config.orgName,
        name: repoName,
        private: true,
        auto_init: true,
        gitignore_template: 'Node',
        description: `Mock Job Project: ${projectName}`
      });

      // Add user as collaborator
      await this.octokit.repos.addCollaborator({
        owner: config.orgName,
        repo: repoName,
        username: userId,
        permission: 'push'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating GitHub repo:', error);
      throw error;
    }
  }

  async setupWorkflowsAndActions(repoName: string) {
    // Add GitHub Actions workflows for CI/CD
    const workflows = {
      'ci.yml': `
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run lint
`,
      'deploy.yml': `
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: aws-actions/configure-aws-credentials@v1
      - run: npm ci
      - run: npm run deploy
`
    };

    for (const [filename, content] of Object.entries(workflows)) {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: config.orgName,
        repo: repoName,
        path: `.github/workflows/${filename}`,
        message: `Add ${filename} workflow`,
        content: Buffer.from(content).toString('base64'),
        branch: config.defaultBranch
      });
    }
  }

  async getRepository(): Promise<Repository> {
    const { data } = await this.octokit.repos.get({
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
  }

  async getIssues(): Promise<Issue[]> {
    const { data } = await this.octokit.issues.listForRepo({
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
  }

  async getRepositoryContent(path: string = ''): Promise<any> {
    const { data } = await this.octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });
    return data;
  }
} 
