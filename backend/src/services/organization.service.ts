import { Employee } from '../models/Employee';
import { buildTree } from '../utils/tree';
import { Types } from 'mongoose';

export const organizationService = {
  async getTree() {
    const roots = await Employee.find({
      reportingManager: null,
      deleted: false,
    }).lean();

    const tree = await Promise.all(
      roots.map((root) =>
        buildTree(root._id as Types.ObjectId)
      )
    );

    return {
      success: true,
      data: tree,
    };
  },
};
