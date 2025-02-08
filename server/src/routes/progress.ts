import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get user progress overview
router.get('/:userId', async (req, res) => {
  try {
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', req.params.userId)
      .single();

    if (progressError) throw progressError;

    const { data: skills, error: skillsError } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills (
          name,
          category
        )
      `)
      .eq('user_id', req.params.userId);

    if (skillsError) throw skillsError;

    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements (
          title,
          description,
          xp
        )
      `)
      .eq('user_id', req.params.userId);

    if (achievementsError) throw achievementsError;

    res.json({
      progress: userProgress,
      skills,
      achievements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update XP and level
router.post('/xp', async (req, res) => {
  const { userId, xpGained } = req.body;

  try {
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('xp, level, next_level_xp')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newXp = currentProgress.xp + xpGained;
    let newLevel = currentProgress.level;
    let newNextLevelXp = currentProgress.next_level_xp;

    // Level up logic
    if (newXp >= currentProgress.next_level_xp) {
      newLevel += 1;
      newNextLevelXp = Math.round(newNextLevelXp * 1.5);
    }

    const { data, error: updateError } = await supabase
      .from('user_progress')
      .update({
        xp: newXp,
        level: newLevel,
        next_level_xp: newNextLevelXp,
        updated_at: new Date()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 