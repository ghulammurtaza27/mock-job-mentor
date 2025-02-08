import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get career progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const { data: careerProgress, error: progressError } = await supabase
      .from('career_progress')
      .select('*')
      .eq('user_id', req.params.userId)
      .single();

    if (progressError) throw progressError;

    const { data: skills, error: skillsError } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills (*)
      `)
      .eq('user_id', req.params.userId);

    if (skillsError) throw skillsError;

    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements (*)
      `)
      .eq('user_id', req.params.userId);

    if (achievementsError) throw achievementsError;

    res.json({
      progress: careerProgress,
      skills,
      achievements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update career goals
router.post('/goals', async (req, res) => {
  const { userId, goals } = req.body;

  try {
    const { data, error } = await supabase
      .from('career_progress')
      .update({ goals })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log interview practice
router.post('/interview-practice', async (req, res) => {
  const { userId, questionId, solution, feedback } = req.body;

  try {
    const { data, error } = await supabase
      .from('interview_practice')
      .insert({
        user_id: userId,
        question_id: questionId,
        solution,
        feedback,
        completed_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 