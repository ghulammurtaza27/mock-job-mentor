import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get application performance metrics
router.get('/metrics', async (req, res) => {
  const { timeframe = '24h' } = req.query;

  try {
    const { data: metrics, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('timestamp', getTimeframeStart(timeframe as string))
      .order('timestamp', { ascending: false });

    if (error) throw error;

    const aggregatedMetrics = {
      responseTime: calculateAverageResponseTime(metrics),
      errorRate: calculateErrorRate(metrics),
      throughput: calculateThroughput(metrics),
      resourceUsage: {
        cpu: calculateAverageCPU(metrics),
        memory: calculateAverageMemory(metrics)
      },
      timeseriesData: generateTimeseriesData(metrics)
    };

    res.json(aggregatedMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log performance event
router.post('/events', async (req, res) => {
  const { type, duration, metadata } = req.body;

  try {
    const { data, error } = await supabase
      .from('performance_events')
      .insert({
        type,
        duration,
        metadata,
        timestamp: new Date()
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