import { Types } from 'mongoose';
import { Employee } from '../models/Employee';

export interface TreeNode {
  _id: string;
  employeeId: string;
  name: string;
  email?: string;
  phone?: string;
  designation: string;
  department: string;
  role: string;
  profileImage: string | null;
  children: TreeNode[];
}

/**
 * Build the reporting tree starting from the given root employee.
 * Uses an iterative approach to avoid deep recursion stack issues.
 */
export async function buildTree(rootId: Types.ObjectId): Promise<TreeNode | null> {
  const root = await Employee.findById(rootId).lean();
  if (!root) return null;

  const visited = new Set<string>([rootId.toString()]);

  async function buildChildren(parentId: Types.ObjectId): Promise<TreeNode[]> {
    const children = await Employee.find({
      reportingManager: parentId,
      deleted: false,
    }).lean();

    console.log("Parent:", parentId.toString());
    console.log(
      "Children:",
      children.map((c) => ({
        name: c.name,
        manager: c.reportingManager?.toString(),
      }))
    );
    const nodes: TreeNode[] = [];
    for (const child of children) {
      const childIdStr = child._id.toString();
      if (visited.has(childIdStr)) continue; // cycle guard
      visited.add(childIdStr);
      const node: TreeNode = {
        _id: child._id.toString(),
        employeeId: child.employeeId,
        name: child.name,
        email: child.email,
        phone: child.phone,
        designation: child.designation,
        department: child.department,
        role: child.role,
        profileImage: child.profileImage,
        children: await buildChildren(child._id),
      };
      nodes.push(node);
    }
    return nodes;
  }
  console.log("Root:", root.name);
  return {
    _id: root._id.toString(),
    employeeId: root.employeeId,
    name: root.name,
     email: root.email,
    phone: root.phone,
    designation: root.designation,
    department: root.department,
    role: root.role,
    profileImage: root.profileImage,
    children: await buildChildren(root._id),
  };
}

/**
 * Check if assigning `managerId` to `employeeId` would create a circular
 * reporting chain. Walks up the manager chain from the proposed manager.
 */
export async function wouldCreateCycle(employeeId: Types.ObjectId, managerId: Types.ObjectId): Promise<boolean> {
  if (employeeId.equals(managerId)) return true;
  const visited = new Set<string>();
  let currentId: Types.ObjectId | null = managerId;
  while (currentId) {
    const idStr = currentId.toString();
    if (visited.has(idStr)) return true; // existing cycle
    visited.add(idStr);
    if (currentId.equals(employeeId)) return true; // employee is an ancestor of manager
    const emp: { reportingManager?: Types.ObjectId | null } | null = await Employee.findById(currentId).lean();
    currentId = emp?.reportingManager ?? null;
  }
  return false;
}
