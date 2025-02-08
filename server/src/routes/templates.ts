import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get project templates
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('project_templates')
      .select(`
        *,
        workflows (
          id,
          name,
          steps
        ),
        ticket_templates (
          id,
          title,
          type,
          description_template
        )
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project from template
router.post('/:templateId/create', async (req, res) => {
  const { name, description, teamMembers } = req.body;

  try {
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('project_templates')
      .select('*')
      .eq('id', req.params.templateId)
      .single();

    if (templateError) throw templateError;

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        template_id: template.id,
        settings: template.default_settings,
        created_at: new Date()
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Add team members
    const members = teamMembers.map(member => ({
      project_id: project.id,
      user_id: member.userId,
      role: member.role
    }));

    await supabase.from('project_members').insert(members);

    // Create default tickets from template
    await createDefaultTickets(project.id, template.id);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save project as template
router.post('/save-as-template', async (req, res) => {
  const { projectId, name, description, isPublic } = req.body;

  try {
    // Get project structure
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        workflows (*)
      `)
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    // Create template
    const { data, error } = await supabase
      .from('project_templates')
      .insert({
        name,
        description,
        is_public: isPublic,
        default_settings: project.settings,
        workflows: project.workflows,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 