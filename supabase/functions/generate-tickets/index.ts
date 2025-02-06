import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, assignedTo } = await req.json();
    
    // Create ticket prompt based on category
    const prompts = {
      feature: "Generate a realistic feature development ticket for a web application",
      bug: "Generate a realistic bug fix ticket for a web application",
      optimization: "Generate a realistic optimization ticket for improving web application performance",
      infrastructure: "Generate a realistic infrastructure improvement ticket for a web application",
    };

    const prompt = prompts[category as keyof typeof prompts];

    // Generate ticket content using GPT
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a technical project manager creating detailed tickets. Format your response as JSON with the following structure:
            {
              "title": "Brief but descriptive title",
              "description": "Detailed description including context, requirements, and acceptance criteria",
              "difficulty": "easy|medium|hard"
            }`
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const ticketContent = JSON.parse(aiData.choices[0].message.content);

    // Create ticket in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          title: ticketContent.title,
          description: ticketContent.description,
          type: category,
          difficulty: ticketContent.difficulty,
          assigned_to: assignedTo,
          status: 'open',
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});