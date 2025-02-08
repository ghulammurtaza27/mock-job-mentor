import { Request, Response, NextFunction } from 'express';

export const validateTicket = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority, status } = req.body;

  if (!title || !description || !priority || !status) {
    return res.status(400).json({
      error: 'Missing required fields'
    });
  }

  if (!['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority value'
    });
  }

  if (!['todo', 'in_progress', 'review', 'done'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status value'
    });
  }

  next();
}; 