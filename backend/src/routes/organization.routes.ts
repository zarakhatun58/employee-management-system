import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/tree', organizationController.tree);

export default router;
