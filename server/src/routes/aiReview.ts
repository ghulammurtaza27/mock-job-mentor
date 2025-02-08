import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Request AI code review
router.post('/review', async (req, res) => {
  const { code, context, ticketId } = req.body;

  try {
    // Generate AI review
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      As a senior developer, review this code:
      Context: ${context}
      
      Code:
      ${code}
      
      Provide feedback on:
      1. Code quality
      2. Best practices
      3. Potential bugs
      4. Performance considerations
      5. Security concerns
    `;

    const result = await model.generateContent(prompt);
    const review = result.response.text();

    // Store review in database
    const { data, error } = await supabase
      .from('ai_code_reviews')
      .insert({
        ticket_id: ticketId,
        code_snippet: code,
        review_content: review,
        context,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI review suggestions
router.post('/suggestions', async (req, res) => {
  const { code, language } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Suggest improvements for this ${language} code:
      ${code}
      
      Provide:
      1. Specific code suggestions
      2. Alternative approaches
      3. Modern best practices
    `;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI code explanations
router.post('/explain', async (req, res) => {
  const { code, language } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Explain this ${language} code in detail:
      ${code}
      
      Include:
      1. High-level overview
      2. Key concepts used
      3. Line-by-line explanation
      4. Purpose and functionality
    `;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 