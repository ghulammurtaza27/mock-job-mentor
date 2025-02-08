import { Router } from 'express';
import ticketRoutes from './tickets';
import userRoutes from './users';
import learningRoutes from './learning';
import progressRoutes from './progress';
import codeReviewRoutes from './codeReview';
import notificationRoutes from './notifications';

const router = Router();

router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/learning', learningRoutes);
router.use('/progress', progressRoutes);
router.use('/code-review', codeReviewRoutes);
router.use('/notifications', notificationRoutes);

export default router; 