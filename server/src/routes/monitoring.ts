import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get system metrics
router.get('/metrics', async (req, res) => {
  try {
    const { data: metrics, error: metricsError } = await supabase
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (metricsError) throw metricsError;

    const { data: alerts, error: alertsError } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('status', 'active');

    if (alertsError) throw alertsError;

    res.json({
      metrics,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create alert
router.post('/alerts', async (req, res) => {
  const { type, severity, message, metadata } = req.body;

  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .insert({
        type,
        severity,
        message,
        metadata,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Notify team members based on alert severity
    if (severity === 'high' || severity === 'critical') {
      await supabase.from('notifications').insert({
        type: 'system_alert',
        title: `${severity.toUpperCase()} Alert`,
        message,
        metadata: {
          alert_id: data.id,
          severity
        }
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system health status
router.get('/health', async (req, res) => {
  try {
    const { data: services, error: servicesError } = await supabase
      .from('service_health')
      .select('*');

    if (servicesError) throw servicesError;

    const { data: incidents, error: incidentsError } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'active');

    if (incidentsError) throw incidentsError;

    res.json({
      services,
      incidents,
      overall_status: incidents.length > 0 ? 'degraded' : 'healthy'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 