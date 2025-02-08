import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to AI mentor
router.post('/chat', async (req, res) => {
  const { userId, message, context } = req.body;

  try {
    // Store user message
    const { data: chatData, error: chatError } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        role: 'user',
        content: message
      })
      .select()
      .single();

    if (chatError) throw chatError;

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Context: ${context}\nUser: ${message}\nAI Mentor:`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Store AI response
    const { data: aiData, error: aiError } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        role: 'assistant',
        content: response,
        parent_id: chatData.id
      })
      .select()
      .single();

    if (aiError) throw aiError;

    res.json({
      message: chatData,
      response: aiData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 