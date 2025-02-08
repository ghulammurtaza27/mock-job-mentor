import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { Octokit } from '@octokit/rest';

const router = Router();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Get pull requests
router.get('/pull-requests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pull_requests')
      .select(`
        *,
        author:user_id (
          name,
          avatar_url
        ),
        reviewers:pr_reviewers (
          user:reviewer_id (
            id,
            name,
            avatar_url
          )
        ),
        ticket:ticket_id (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create pull request
router.post('/pull-requests', async (req, res) => {
  const { title, description, branch, ticketId, userId } = req.body;

  try {
    // Create PR in GitHub
    const { data: githubPR } = await octokit.pulls.create({
      owner: process.env.GITHUB_OWNER || '',
      repo: process.env.GITHUB_REPO || '',
      title,
      body: description,
      head: branch,
      base: 'main'
    });

    // Store PR in database
    const { data, error } = await supabase
      .from('pull_requests')
      .insert({
        github_id: githubPR.number,
        title,
        description,
        branch,
        ticket_id: ticketId,
        user_id: userId,
        status: 'open',
        github_url: githubPR.html_url
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await supabase.from('notifications').insert({
      type: 'pull_request_created',
      title: 'New Pull Request',
      message: `A new PR has been created: ${title}`,
      metadata: {
        pr_id: data.id,
        github_url: githubPR.html_url
      }
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get branch protection rules
router.get('/branch-rules', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('branch_protection_rules')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 