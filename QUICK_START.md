# Quick Start Guide - New Features

## What Was Built

Complete CRUD (Create, Read, Update, Delete) operations for:

1. **Projects** - `/projects`
2. **Organizations** - `/organizations`
3. **Employee Expenses** - `/employee-expenses`
4. **Client Expenses** - `/client-expenses`
5. **Personal Expenses** - `/personal-expenses`

Plus updated Attendance schema with new status types and clock in/out times.

## Quick Setup

### 1. Run Database Migration

```bash
npm run migrate:up
```

This creates all new tables and updates the attendance table.

### 2. Start the Server

```bash
npm run dev
```

### 3. Test an Endpoint

```bash
# Login to get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Create a project (replace TOKEN with your JWT)
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "projectName": "Test Project",
    "clientName": "Test Client",
    "startDate": "2026-01-20",
    "status": "pending",
    "budget": 50000
  }'
```

## Key Files Created

**Migration:**
- `migrations/1736900000000_add-new-tables.cjs`

**Repositories (5 files):**
- `src/repositories/project.repository.ts`
- `src/repositories/organization.repository.ts`
- `src/repositories/employeeExpense.repository.ts`
- `src/repositories/companyClientExpense.repository.ts`
- `src/repositories/companyPersonalExpense.repository.ts`

**Services (5 files):**
- `src/services/project.service.ts`
- `src/services/organization.service.ts`
- `src/services/employeeExpense.service.ts`
- `src/services/companyClientExpense.service.ts`
- `src/services/companyPersonalExpense.service.ts`

**Controllers (5 files):**
- `src/controllers/project.controller.ts`
- `src/controllers/organization.controller.ts`
- `src/controllers/employeeExpense.controller.ts`
- `src/controllers/companyClientExpense.controller.ts`
- `src/controllers/companyPersonalExpense.controller.ts`

**Routes (5 files):**
- `src/routes/project.routes.ts`
- `src/routes/organization.routes.ts`
- `src/routes/employeeExpense.routes.ts`
- `src/routes/companyClientExpense.routes.ts`
- `src/routes/companyPersonalExpense.routes.ts`

**Updated:**
- `src/index.ts` - Added new route registrations
- `src/db/schema.ts` - Added new interfaces

## Common Operations

### Create a Record
```http
POST /projects
POST /organizations
POST /employee-expenses
POST /client-expenses
POST /personal-expenses
```

### Get All Records (with filters)
```http
GET /projects?status=pending&clientName=ABC
GET /organizations?purchasePlain=premium
GET /employee-expenses?userId=5&status=paid
GET /client-expenses?startDate=2026-01-01
GET /personal-expenses?category=operational
```

### Get Single Record
```http
GET /projects/1
GET /organizations/1
```

### Update Record
```http
PUT /projects/1
PUT /organizations/1
```

### Delete Record
```http
DELETE /projects/1
DELETE /organizations/1
```

## Status Values

**Projects:** pending, in progress, completed, on hold, cancelled

**Organizations:** (custom values allowed)

**Expenses:** pending, paid, processing

**Attendance (updated):** absent, present, on leave, late

## Important Notes

- ✅ All endpoints require authentication
- ✅ All responses follow consistent format
- ✅ Proper error handling implemented
- ✅ Input validation included
- ✅ Foreign key relationships maintained
- ✅ Soft delete for Projects & Organizations
- ✅ Created migration is reversible (`npm run migrate:down`)

## Documentation

Full details in: `API_IMPLEMENTATION.md`
