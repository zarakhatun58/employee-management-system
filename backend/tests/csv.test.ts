import { importEmployees, parseCsvBuffer } from '../src/utils/csv';
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

describe('parseCsvBuffer', () => {
  it('parses CSV with headers', async () => {
    const csv = 'employeeId,name,email,phone,department,designation,salary,joiningDate\n1,John,j@x.com,+1,Eng,Dev,100,2024-01-01\n';
    const rows = await parseCsvBuffer(Buffer.from(csv));
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('John');
    expect(rows[0].email).toBe('j@x.com');
  });
});

describe('importEmployees', () => {
  it('creates new employees from valid rows', async () => {
    const rows = [
      { employeeId: '1', name: 'John', email: 'j@x.com', phone: '+1', department: 'Eng', designation: 'Dev', salary: '100', joiningDate: '2024-01-01' },
    ];
    const result = await importEmployees(rows);
    expect(result.created).toBe(1);
    expect(result.updated).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('updates existing employees by employeeId', async () => {
    await Employee.create({
      employeeId: '1', name: 'Old', email: 'old@x.com', phone: '+1',
      department: 'Eng', designation: 'Dev', salary: 50, joiningDate: new Date(),
    });
    const rows = [
      { employeeId: '1', name: 'New', email: 'new@x.com', phone: '+1', department: 'Eng', designation: 'Dev', salary: '100', joiningDate: '2024-01-01' },
    ];
    const result = await importEmployees(rows);
    expect(result.updated).toBe(1);
    expect(result.created).toBe(0);
    const updated = await Employee.findOne({ employeeId: '1' });
    expect(updated?.name).toBe('New');
  });

  it('collects errors for invalid rows', async () => {
    const rows = [
      { employeeId: '', name: '', email: '', phone: '+1' },
    ];
    const result = await importEmployees(rows);
    expect(result.created).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
