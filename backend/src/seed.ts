import { connectDB, disconnectDB } from './config/database';
import { User } from './models/User';
import { Employee } from './models/Employee';
import { hashPassword } from './utils/bcrypt';


async function seed() {
  await connectDB();
  console.log('Seeding database...');

  await User.deleteMany({});
  await Employee.deleteMany({});

  // Employees
  const emp1 = await Employee.create({
    employeeId: 'EMP001', name: 'Alice Johnson', email: 'alice@ems.com', phone: '+1-555-0101',
    department: 'Engineering', designation: 'VP Engineering', salary: 180000,
    joiningDate: new Date('2020-01-15'), status: 'active', role: 'employee', reportingManager: null,
  });
  const emp2 = await Employee.create({
    employeeId: 'EMP002', name: 'Bob Smith', email: 'bob@ems.com', phone: '+1-555-0102',
    department: 'Engineering', designation: 'Engineering Manager', salary: 140000,
    joiningDate: new Date('2020-06-01'), status: 'active', role: 'employee', reportingManager: emp1._id,
  });
  const emp3 = await Employee.create({
    employeeId: 'EMP003', name: 'Carol White', email: 'carol@ems.com', phone: '+1-555-0103',
    department: 'Engineering', designation: 'Senior Developer', salary: 110000,
    joiningDate: new Date('2021-03-10'), status: 'active', role: 'employee', reportingManager: emp2._id,
  });
  const emp4 = await Employee.create({
    employeeId: 'EMP004', name: 'Dave Brown', email: 'dave@ems.com', phone: '+1-555-0104',
    department: 'Engineering', designation: 'Developer', salary: 90000,
    joiningDate: new Date('2022-07-20'), status: 'active', role: 'employee', reportingManager: emp2._id,
  });
  const emp5 = await Employee.create({
    employeeId: 'EMP005', name: 'Eve Davis', email: 'eve@ems.com', phone: '+1-555-0105',
    department: 'Sales', designation: 'VP Sales', salary: 160000,
    joiningDate: new Date('2020-02-01'), status: 'active', role: 'employee', reportingManager: null,
  });
  const emp6 = await Employee.create({
    employeeId: 'EMP006', name: 'Frank Miller', email: 'frank@ems.com', phone: '+1-555-0106',
    department: 'Sales', designation: 'Sales Manager', salary: 120000,
    joiningDate: new Date('2021-01-15'), status: 'active', role: 'employee', reportingManager: emp5._id,
  });
  const emp7 = await Employee.create({
    employeeId: 'EMP007', name: 'Grace Lee', email: 'grace@ems.com', phone: '+1-555-0107',
    department: 'Sales', designation: 'Sales Rep', salary: 75000,
    joiningDate: new Date('2022-11-01'), status: 'active', role: 'employee', reportingManager: emp6._id,
  });
  const emp8 = await Employee.create({
    employeeId: 'EMP008', name: 'Henry Wilson', email: 'henry@ems.com', phone: '+1-555-0108',
    department: 'Marketing', designation: 'Marketing Lead', salary: 115000,
    joiningDate: new Date('2021-09-15'), status: 'active', role: 'employee', reportingManager: null,
  });
  const emp9 = await Employee.create({
    employeeId: 'EMP009', name: 'Ivy Chen', email: 'ivy@ems.com', phone: '+1-555-0109',
    department: 'Marketing', designation: 'Content Writer', salary: 70000,
    joiningDate: new Date('2023-02-20'), status: 'active', role: 'employee', reportingManager: emp8._id,
  });
  const emp10 = await Employee.create({
    employeeId: 'EMP010', name: 'Jack Taylor', email: 'jack@ems.com', phone: '+1-555-0110',
    department: 'HR', designation: 'HR Specialist', salary: 80000,
    joiningDate: new Date('2022-04-10'), status: 'inactive', role: 'employee', reportingManager: null,
  });
  const emp11 = await Employee.create({
    employeeId: 'EMP011', name: 'Kate Anderson', email: 'kate@ems.com', phone: '+1-555-0111',
    department: 'Finance', designation: 'Finance Manager', salary: 125000,
    joiningDate: new Date('2021-05-01'), status: 'active', role: 'employee', reportingManager: null,
  });
  const emp12 = await Employee.create({
    employeeId: 'EMP012', name: 'Liam Garcia', email: 'liam@ems.com', phone: '+1-555-0112',
    department: 'Operations', designation: 'Operations Lead', salary: 95000,
    joiningDate: new Date('2022-08-15'), status: 'active', role: 'employee', reportingManager: null,
  });

  // Users (auth accounts)
  const adminPw = await hashPassword('Admin@123');
  const hrPw = await hashPassword('Hr@12345');
  const empPw = await hashPassword('Alice@123');

  await User.create({
    name: 'Super Admin', email: 'admin@ems.com', password: adminPw, role: 'super_admin',
  });
  await User.create({
    name: 'HR Manager', email: 'hr@ems.com', password: hrPw, role: 'hr',
  });
  await User.create({
    name: 'Alice Johnson', email: 'alice@ems.com', password: empPw, role: 'employee', employeeId: emp1.employeeId,
  });

  console.log('✓ Seed complete. Demo accounts:');
  console.log('  Super Admin: admin@ems.com / Admin@123');
  console.log('  HR Manager:  hr@ems.com / Hr@12345');
  console.log('  Employee:    alice@ems.com / Alice@123');

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
