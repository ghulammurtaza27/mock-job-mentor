import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get code reviews for a ticket
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('code_reviews')
      .select(`
        *,
        reviewer:user_id (
          id,
          name,
          avatar_url
        ),
        ticket:ticket_id (
          title,
          status
        )
      `)
      .eq('ticket_id', req.params.ticketId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a code review
router.post('/', async (req, res) => {
  const { ticketId, userId, content, status, suggestions } = req.body;

  try {
    const { data, error } = await supabase
      .from('code_reviews')
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        content,
        status,
        suggestions,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for ticket owner
    await supabase
      .from('notifications')
      .insert({
        user_id: data.ticket.assigned_to,
        type: 'code_review',
        title: 'New Code Review',
        message: `Your ticket has received a new code review`,
        metadata: {
          ticket_id: ticketId,
          review_id: data.id
        }
      });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update code review status
router.patch('/:reviewId', async (req, res) => {
  const { status, resolution_comment } = req.body;

  try {
    const { data, error } = await supabase
      .from('code_reviews')
      .update({
        status,
        resolution_comment,
        resolved_at: status === 'resolved' ? new Date() : null
      })
      .eq('id', req.params.reviewId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 