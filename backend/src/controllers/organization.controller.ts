import { Response } from 'express';
import { organizationService } from '../services/organization.service';
import { AuthRequest } from '../middleware/auth.middleware';


export const organizationController = {
  async tree(_req: AuthRequest, res: Response) {
    const tree = await organizationService.getTree();
    res.json(tree);
  },
};
