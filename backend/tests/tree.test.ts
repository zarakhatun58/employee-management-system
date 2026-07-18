import { wouldCreateCycle, buildTree } from '../src/utils/tree';
import { Employee } from '../src/models/Employee';
import { connectDB, disconnectDB } from '../src/config/database';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await Employee.deleteMany({});
});

describe('wouldCreateCycle', () => {
  it('returns true if employee is assigned as their own manager', async () => {
    const emp = await Employee.create({
      employeeId: 'E1', name: 'A', email: 'a@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const cycle = await wouldCreateCycle(emp._id, emp._id);
    expect(cycle).toBe(true);
  });

  it('returns true if assigning creates a chain back to the employee', async () => {
    const a = await Employee.create({
      employeeId: 'E1', name: 'A', email: 'a@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const b = await Employee.create({
      employeeId: 'E2', name: 'B', email: 'b@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
      reportingManager: a._id,
    });
    // A -> B -> A would be a cycle; assigning B as A's manager
    const cycle = await wouldCreateCycle(a._id, b._id);
    expect(cycle).toBe(true);
  });

  it('returns false for a valid manager assignment', async () => {
    const a = await Employee.create({
      employeeId: 'E1', name: 'A', email: 'a@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const b = await Employee.create({
      employeeId: 'E2', name: 'B', email: 'b@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const cycle = await wouldCreateCycle(b._id, a._id);
    expect(cycle).toBe(false);
  });
});

describe('buildTree', () => {
  it('builds a tree from root with children', async () => {
    const root = await Employee.create({
      employeeId: 'R', name: 'Root', email: 'r@x.com', phone: '+1',
      department: 'Eng', designation: 'VP', salary: 200, joiningDate: new Date(),
    });
    const child = await Employee.create({
      employeeId: 'C', name: 'Child', email: 'c@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
      reportingManager: root._id,
    });
    await Employee.create({
      employeeId: 'G', name: 'Grandchild', email: 'g@x.com', phone: '+1',
      department: 'Eng', designation: 'Junior', salary: 80, joiningDate: new Date(),
      reportingManager: child._id,
    });

    const tree = await buildTree(root._id);
    expect(tree?.name).toBe('Root');
    expect(tree?.children).toHaveLength(1);
    expect(tree?.children[0].name).toBe('Child');
    expect(tree?.children[0].children).toHaveLength(1);
    expect(tree?.children[0].children[0].name).toBe('Grandchild');
  });
});
