import request from 'supertest';
import { createApp } from '../src/app';
import { connectDB, disconnectDB } from '../src/config/database';
import { User } from '../src/models/User';
import { Employee } from '../src/models/Employee';
import { hashPassword } from '../src/utils/bcrypt';

const app = createApp();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Employee.deleteMany({});
});

describe('Auth API', () => {
  it('logs in with valid credentials and returns a token', async () => {
    const pw = await hashPassword('Password123');
    await User.create({ name: 'Admin', email: 'admin@x.com', password: pw, role: 'super_admin' });

    const res = await request(app).post('/api/auth/login').send({ email: 'admin@x.com', password: 'Password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin@x.com');
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@x.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('validates login payload', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: '12' });
    expect(res.status).toBe(422);
  });
});

describe('Employees API (RBAC)', () => {
  let adminToken: string;
  let hrToken: string;
  let empToken: string;

  beforeEach(async () => {
    const adminPw = await hashPassword('Admin@123');
    const hrPw = await hashPassword('Hr@12345');
    const empPw = await hashPassword('Emp@12345');
    await User.create({ name: 'Admin', email: 'admin@x.com', password: adminPw, role: 'super_admin' });
    await User.create({ name: 'HR', email: 'hr@x.com', password: hrPw, role: 'hr' });
    await User.create({ name: 'Emp', email: 'emp@x.com', password: empPw, role: 'employee' });

    adminToken = (await request(app).post('/api/auth/login').send({ email: 'admin@x.com', password: 'Admin@123' })).body.token;
    hrToken = (await request(app).post('/api/auth/login').send({ email: 'hr@x.com', password: 'Hr@12345' })).body.token;
    empToken = (await request(app).post('/api/auth/login').send({ email: 'emp@x.com', password: 'Emp@12345' })).body.token;
  });

  it('allows admin to create an employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('employeeId', 'E1')
      .field('name', 'John Doe')
      .field('email', 'john@x.com')
      .field('phone', '+1-555-0100')
      .field('department', 'Engineering')
      .field('designation', 'Developer')
      .field('salary', '90000')
      .field('joiningDate', '2024-01-15');
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
  });

  it('forbids employee from creating', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${empToken}`)
      .field('employeeId', 'E2')
      .field('name', 'Jane')
      .field('email', 'jane@x.com')
      .field('phone', '+1-555-0200')
      .field('department', 'Engineering')
      .field('designation', 'Developer')
      .field('salary', '90000')
      .field('joiningDate', '2024-01-15');
    expect(res.status).toBe(403);
  });

  it('forbids HR from deleting', async () => {
    const created = await Employee.create({
      employeeId: 'E1', name: 'John', email: 'john@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const res = await request(app)
      .delete(`/api/employees/${created._id}`)
      .set('Authorization', `Bearer ${hrToken}`);
    expect(res.status).toBe(403);
  });

  it('allows admin to delete (soft)', async () => {
    const created = await Employee.create({
      employeeId: 'E1', name: 'John', email: 'john@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
    });
    const res = await request(app)
      .delete(`/api/employees/${created._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const emp = await Employee.findById(created._id);
    expect(emp?.deleted).toBe(true);
  });

  it('returns paginated employee list', async () => {
    for (let i = 1; i <= 15; i++) {
      await Employee.create({
        employeeId: `E${i}`, name: `Emp${i}`, email: `e${i}@x.com`, phone: '+1',
        department: 'Eng', designation: 'Dev', salary: 100, joiningDate: new Date(),
      });
    }
    const res = await request(app)
      .get('/api/employees?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.total).toBe(15);
    expect(res.body.pages).toBe(2);
  });
});
