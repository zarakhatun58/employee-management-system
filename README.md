# Employee Management System (EMS)

A modern full-stack Employee Management System built with React, TypeScript, Node.js, Express, and MongoDB.

The application provides secure authentication, role-based access control, employee management, organization hierarchy, dashboard analytics, reporting, and administrative tools.

---

## Features

### Authentication

- JWT Authentication
- Refresh Token Authentication
- Secure Password Hashing
- Protected Routes
- Role Based Authorization
- Profile Management

---

### Dashboard

- Employee Statistics
- Active & Inactive Employees
- Department Statistics
- Monthly Joining Analytics
- Employee Growth Charts
- Recent Employees
- Quick Actions
- Profile Summary

---

### Employee Management

- Create Employee
- Update Employee
- Delete Employee (Soft Delete)
- Employee Details
- Employee Search
- Employee Filters
- Employee Sorting
- Pagination
- Employee Profile Image

---

### Organization Management

- Reporting Manager Assignment
- Organization Hierarchy
- Direct Reportees
- Circular Reporting Prevention

---

### Reports

- Employee Statistics
- Department Summary
- Active vs Inactive Employees
- Workforce Overview
- Printable Reports

---

### Settings

- System Information
- Application Version
- Role Information
- Theme Support
- Account Information

---

### User Roles

- Super Admin
- HR Manager
- Employee

Permissions are automatically managed based on user role.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- Recharts
- Lucide React
## Frontend Unit Tests

The frontend includes unit tests using **Jest** and **React Testing Library**.

### Tested Components

- ✅ Login
  - Email validation
  - Password validation
  - Successful login submission

- ✅ Employee Form
  - Required field validation
  - Invalid email validation
  - Invalid phone validation
  - Salary validation
  - Form submission

### Run Tests

```bash
cd frontend

npm install

npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Testing Stack

- Jest
- React Testing Library
- @testing-library/jest-dom
- jest-environment-jsdom
---

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## Project Structure

```
employee-management-system/
│
├── backend/
│
├── frontend/
│
├── API.md
│
└── README.md
```

---

## Getting Started

### Clone Repository

```bash
git clone <repository-url>
```

---

### Install Dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

### Run Backend

```bash
npm run dev
```

---

### Run Frontend

```bash
npm run dev
```

---

## Screens

- Login
- Dashboard
- Employee List
- Employee Details
- Add Employee
- Edit Employee
- Organization Chart
- Reports
- Settings
- Profile Modal

---

## Role Permissions

| Feature | Super Admin | HR | Employee |
|----------|------------|----|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Employees | ✅ | ✅ | View |
| Add Employee | ✅ | ✅ | ❌ |
| Edit Employee | ✅ | ✅ | Own Profile |
| Delete Employee | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ |
| Organization | ✅ | ✅ | View |

---

## Security

- JWT Authentication
- Refresh Tokens
- Password Hashing
- Protected APIs
- Role Based Authorization
- Input Validation
- Error Handling

---

## UI Features

- Responsive Design
- Dark Mode
- Mobile Friendly
- Reusable Components
- Modern Dashboard
- Charts & Analytics
- Toast Notifications
- Loading States
- Empty States
- Confirmation Modals

---

## Future Improvements

- Email Notifications
- Audit Logs
- Attendance Management
- Leave Management
- Payroll Module
- Export Reports (PDF/Excel)
- Multi-language Support

---

## Documentation

Complete API documentation is available in:

```
API.md
```

---

## License

This project is developed for learning, demonstration, and full-stack development purposes.

# Author

Jahanara Khatun

Full Stack Developer

React.js • Node.js • TypeScript • MongoDB • Express.js