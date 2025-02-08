import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { marked } from 'marked';

const router = Router();

// Get documentation tree
router.get('/tree', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documentation')
      .select(`
        id,
        title,
        parent_id,
        order,
        type,
        updated_at
      `)
      .order('order', { ascending: true });

    if (error) throw error;

    const tree = buildDocumentationTree(data);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documentation')
      .select(`
        *,
        author:author_id (
          name,
          avatar_url
        ),
        last_editor:last_edited_by (
          name,
          avatar_url
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Convert markdown to HTML if needed
    if (data.format === 'markdown') {
      data.content_html = marked(data.content);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update document
router.post('/', async (req, res) => {
  const { id, title, content, parentId, order, type } = req.body;

  try {
    const { data, error } = await supabase
      .from('documentation')
      .upsert({
        id,
        title,
        content,
        parent_id: parentId,
        order,
        type,
        last_edited_by: req.user.id,
        updated_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search documentation
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const { data, error } = await supabase
      .from('documentation')
      .select('*')
      .textSearch('content', query as string)
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 