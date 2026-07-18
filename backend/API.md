# API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/login
Authenticate a user and receive a JWT.

**Request:**
```json
{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "name": "Super Admin",
    "email": "admin@ems.com",
    "role": "super_admin",
    "employeeId": null
  }
}
```

**Errors:** 401 (invalid credentials), 422 (validation)

### POST /auth/logout
Invalidate the session (client-side token discard).

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

### GET /auth/me
Get the current authenticated user.

**Response (200):**
```json
{ "user": { ... } }
```

---

## Employees

### GET /employees
List employees with search, filter, sort, and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 10, max 100) |
| `search` | string | Search by name or email |
| `department` | string | Filter by department |
| `role` | string | Filter by role (`super_admin`, `hr`, `employee`) |
| `status` | string | Filter by status (`active`, `inactive`) |
| `sortBy` | string | `name`, `joiningDate`, `salary`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` |

**Response (200):**
```json
{
  "data": [ { ...employee, "reportingManagerName": "..." } ],
  "total": 50,
  "page": 1,
  "pages": 5,
  "limit": 10
}
```

### GET /employees/:id
Get a single employee by ID.

**Response (200):** Employee object with `reportingManagerName`.

### POST /employees
Create a new employee. **(Super Admin, HR)**

**Body (multipart/form-data):**
| Field | Type | Required |
|-------|------|----------|
| `employeeId` | string | yes |
| `name` | string | yes |
| `email` | string | yes |
| `phone` | string | yes |
| `department` | string | yes |
| `designation` | string | yes |
| `salary` | number | yes |
| `joiningDate` | date (ISO) | yes |
| `status` | `active` \| `inactive` | no |
| `role` | `super_admin` \| `hr` \| `employee` | no |
| `reportingManager` | string (ObjectId) | no |
| `profileImage` | file | no |

**Response (201):** Created employee.

### PUT /employees/:id
Update an employee. **(Super Admin, HR)** Same body as POST.

### DELETE /employees/:id
Soft-delete an employee (sets `deleted: true`, `status: inactive`, unlinks reportees). **(Super Admin)**

**Response (200):**
```json
{ "message": "Employee deleted" }
```

### GET /employees/:id/reportees
Get direct reportees of an employee.

**Response (200):** Array of employee objects.

### PATCH /employees/:id/manager
Assign or change the reporting manager. **(Super Admin)**

**Body:**
```json
{ "reportingManager": "<ObjectId>" }
```
Pass `null` or empty string to remove the manager.

**Response (200):** Updated employee.

### POST /employees/import
Import employees from a CSV file. **(Super Admin, HR)**

**Body (multipart/form-data):** `file` field with a `.csv` file.

**Response (201):**
```json
{
  "created": 5,
  "updated": 2,
  "errors": ["Line 4: missing required fields"]
}
```

---

## Organization

### GET /organization/tree
Get the full reporting hierarchy as a nested tree.

**Response (200):**
```json
{
  "_id": "...",
  "name": "Root Manager",
  "designation": "CEO",
  "department": "Executive",
  "role": "super_admin",
  "children": [
    {
      "_id": "...",
      "name": "...",
      "children": [ ... ]
    }
  ]
}
```

---

## Dashboard

### GET /dashboard/stats
Get aggregate dashboard statistics.

**Response (200):**
```json
{
  "totalEmployees": 50,
  "activeEmployees": 45,
  "inactiveEmployees": 5,
  "departmentCount": 6,
  "departments": [
    { "department": "Engineering", "count": 20 }
  ],
  "roleDistribution": [
    { "role": "super_admin", "count": 1 }
  ],
  "monthlyJoinings": [
    { "month": "Jan 24", "count": 3 }
  ]
}
```

---

## Error Responses

All errors return a consistent JSON shape:

```json
{
  "message": "Error description",
  "errors": {
    "field": "field-specific message"
  }
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 422 | Validation failed |
| 500 | Server error |
