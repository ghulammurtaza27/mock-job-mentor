import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const port = process.env.PORT || 3001;

// Initialize Supabase client (service key is required for Admin-level access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = express();
app.use(express.json());

// ----------------------------------------------
// Routes: Users
// ----------------------------------------------
app.get('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching user' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Missing required fields: email or name' });
  }

  try {
    // Create user record in the "users" table - example
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name }])
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error creating user' });
  }
});

// ----------------------------------------------
// Routes: Tickets
// ----------------------------------------------
app.get('/api/tickets', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching tickets' });
  }
});

app.post('/api/tickets', async (req: Request, res: Response) => {
  const { title, assigned_to } = req.body;
  if (!title || !assigned_to) {
    return res.status(400).json({ error: 'Missing required fields: title or assigned_to' });
  }

  try {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{ title, assigned_to }])
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error creating ticket' });
  }
});

// ----------------------------------------------
// Routes: Solutions
// ----------------------------------------------
app.get('/api/solutions', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('solutions')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching solutions' });
  }
});

app.post('/api/solutions', async (req: Request, res: Response) => {
  const { ticket_id, user_id, content } = req.body;
  if (!ticket_id || !user_id || !content) {
    return res.status(400).json({ error: 'Missing required fields: ticket_id, user_id, or content' });
  }

  try {
    const { data, error } = await supabase
      .from('solutions')
      .insert([{ ticket_id, user_id, content }])
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error creating solution' });
  }
});

// ----------------------------------------------
// Routes: AI Requests (Google Gemini usage)
// ----------------------------------------------
app.post('/api/ai', async (req: Request, res: Response) => {
  const { user_id, prompt } = req.body;
  if (!user_id || !prompt) {
    return res.status(400).json({
      error: 'Missing required fields: user_id or prompt',
    });
  }

  try {
    // TODO: Call Google Gemini with the prompt - STUB implementation
    // const geminiResponse = await callGeminiAPI(prompt);

    // For demonstration, we simulate the AI reply:
    const geminiResponse = `AI response for prompt: "${prompt}"`;

    // Store the request + AI response in "ai_requests"
    const { data, error } = await supabase
      .from('ai_requests')
      .insert([{ user_id, prompt, response: geminiResponse }])
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'AI request processed successfully',
      record: data,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error processing AI request' });
  }
});

// ----------------------------------------------
// Start Server
// ----------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 