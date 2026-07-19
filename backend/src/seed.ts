import mongoose from "mongoose";
import dotenv from "dotenv";

import { Employee } from "./models/Employee";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  console.log("Connected to MongoDB");

  await Employee.deleteMany({});

  console.log("Old employees deleted");

  // CEO
  const ceo = await Employee.create({
    employeeId: "EMP001",
    name: "Robert Williams",
    email: "ceo@ems.com",
    phone: "9000000001",
    department: "Management",
    designation: "Chief Executive Officer",
    salary: 300000,
    joiningDate: new Date("2021-01-01"),
    status: "active",
    role: "super_admin",
    reportingManager: null,
  });

  // CTO
  const cto = await Employee.create({
    employeeId: "EMP002",
    name: "Sarah Johnson",
    email: "cto@ems.com",
    phone: "9000000002",
    department: "Technology",
    designation: "Chief Technology Officer",
    salary: 250000,
    joiningDate: new Date("2021-02-01"),
    status: "active",
    role: "employee",
    reportingManager: ceo._id,
  });

  // HR Manager
  const hr = await Employee.create({
    employeeId: "EMP003",
    name: "Emily Davis",
    email: "hr@ems.com",
    phone: "9000000003",
    department: "HR",
    designation: "HR Manager",
    salary: 150000,
    joiningDate: new Date("2021-03-01"),
    status: "active",
    role: "hr",
    reportingManager: ceo._id,
  });

  // Sales Manager
  const salesManager = await Employee.create({
    employeeId: "EMP004",
    name: "Michael Brown",
    email: "sales.manager@ems.com",
    phone: "9000000004",
    department: "Sales",
    designation: "Sales Manager",
    salary: 145000,
    joiningDate: new Date("2021-03-15"),
    status: "active",
    role: "employee",
    reportingManager: ceo._id,
  });

  // Engineering Manager
  const engManager = await Employee.create({
    employeeId: "EMP005",
    name: "David Miller",
    email: "manager@ems.com",
    phone: "9000000005",
    department: "Technology",
    designation: "Engineering Manager",
    salary: 180000,
    joiningDate: new Date("2022-01-10"),
    status: "active",
    role: "employee",
    reportingManager: cto._id,
  });

  // QA Lead
  const qaLead = await Employee.create({
    employeeId: "EMP006",
    name: "Sophia Wilson",
    email: "qa@ems.com",
    phone: "9000000006",
    department: "Technology",
    designation: "QA Lead",
    salary: 120000,
    joiningDate: new Date("2022-02-10"),
    status: "active",
    role: "employee",
    reportingManager: cto._id,
  });

  await Employee.insertMany([
    {
      employeeId: "EMP007",
      name: "John Smith",
      email: "john@ems.com",
      phone: "9000000007",
      department: "Technology",
      designation: "Senior React Developer",
      salary: 95000,
      joiningDate: new Date("2023-01-15"),
      status: "active",
      role: "employee",
      reportingManager: engManager._id,
    },
    {
      employeeId: "EMP008",
      name: "John Doe",
      email: "react@ems.com",
      phone: "9000000008",
      department: "Technology",
      designation: "React Developer",
      salary: 85000,
      joiningDate: new Date("2023-03-12"),
      status: "active",
      role: "employee",
      reportingManager: engManager._id,
    },
    {
      employeeId: "EMP009",
      name: "Daniel Thomas",
      email: "node@ems.com",
      phone: "9000000009",
      department: "Technology",
      designation: "Node.js Developer",
      salary: 85000,
      joiningDate: new Date("2023-04-18"),
      status: "active",
      role: "employee",
      reportingManager: engManager._id,
    },
    {
      employeeId: "EMP010",
      name: "Olivia Taylor",
      email: "design@ems.com",
      phone: "9000000010",
      department: "Design",
      designation: "UI/UX Designer",
      salary: 80000,
      joiningDate: new Date("2023-05-20"),
      status: "active",
      role: "employee",
      reportingManager: engManager._id,
    },
    {
      employeeId: "EMP011",
      name: "Emma Garcia",
      email: "qa.engineer@ems.com",
      phone: "9000000011",
      department: "Technology",
      designation: "QA Engineer",
      salary: 72000,
      joiningDate: new Date("2023-06-12"),
      status: "active",
      role: "employee",
      reportingManager: qaLead._id,
    },
    {
      employeeId: "EMP012",
      name: "William Scott",
      email: "sales@ems.com",
      phone: "9000000012",
      department: "Sales",
      designation: "Sales Executive",
      salary: 65000,
      joiningDate: new Date("2023-07-15"),
      status: "active",
      role: "employee",
      reportingManager: salesManager._id,
    },
    {
      employeeId: "EMP013",
      name: "Chris Walker",
      email: "hr.executive@ems.com",
      phone: "9000000013",
      department: "HR",
      designation: "HR Executive",
      salary: 70000,
      joiningDate: new Date("2023-08-01"),
      status: "active",
      role: "employee",
      reportingManager: hr._id,
    },
    {
      employeeId: "EMP014",
      name: "Sophie Adams",
      email: "recruiter@ems.com",
      phone: "9000000014",
      department: "HR",
      designation: "Recruiter",
      salary: 68000,
      joiningDate: new Date("2023-08-20"),
      status: "active",
      role: "employee",
      reportingManager: hr._id,
    },
  ]);

  console.log("EMS organization seeded successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});