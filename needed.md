# Backend Endpoints Needed for Payroll & HRIS Modules

This document details the backend endpoints and schema enhancements required by the **CebizPay Organization Portal** frontend. These endpoints are currently missing (`404 Not Found`) or require unified composite handling on the live backend (`https://cebizpay.onrender.com`).

---

## 1. Organization Payroll Analytics Summary

Retrieves tenant-scoped aggregated payroll expenditure metrics and category spend distributions for the active corporate organization. This powers the 4 primary KPI cards and analytical category breakdowns on the Organization Payroll Analytics dashboard (`/org/payroll`).

* **Method**: `GET`
* **Route**: `/api/v1/org/payroll/analytics`
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`
* **Query Parameters**:
  * `year` (`integer`, optional, default: current year): Filter by calendar year.
  * `currency` (`string`, optional, default: `"NGN"`): Base operational currency.

### Expected Response (`200 OK`)
```json
{
  "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",
  "currency": "NGN",
  "metrics": {
    "totalSpendLocal": {
      "amount": 238000909.00,
      "currency": "NGN",
      "trendDescription": "43,000.00 Less than a year"
    },
    "totalSpendInternational": {
      "amount": 238000909.00,
      "currency": "NGN",
      "trendDescription": "43,000.00 Less than a year"
    },
    "totalSpendUsdt": {
      "amount": 9.00,
      "currency": "USDT",
      "trendDescription": "43,000.00 Less than a year"
    },
    "totalEmployeesPaid": {
      "count": 89,
      "trendDescription": "43,000.00 Less than a year"
    }
  },
  "breakdown": {
    "general": [
      {
        "id": "spend-breakdown",
        "title": "Payroll spend breakdown",
        "description": "0% of your NGN payroll this year was allocated to paying out salaries"
      },
      {
        "id": "spend-annual",
        "title": "Average payroll spend by annual",
        "description": "On the average, you spent 100% lesser than other companies in your industry (Commerce) last year."
      },
      {
        "id": "spend-dept",
        "title": "Payroll spend per Department",
        "description": "-Infinity% of your NGN payroll this year was allocated to paying out employees in"
      }
    ],
    "payrollSpend": [
      {
        "id": "direct-salaries",
        "title": "Direct Salaries Allocation",
        "description": "92% allocated towards gross direct salaries and basic allowances."
      },
      {
        "id": "benefits-tax",
        "title": "Statutory Taxes & Pension",
        "description": "8% allocated towards PAYE, NHF, and statutory employee deductions."
      }
    ],
    "salariesAnalytics": [
      {
        "id": "median-salary",
        "title": "Median Monthly Salary",
        "description": "The average median salary across active full-time departments is ₦350,000."
      },
      {
        "id": "top-earning-dept",
        "title": "Top Earning Department",
        "description": "Engineering and Product account for 44% of total compensation disbursements."
      }
    ],
    "othersAnalytics": [
      {
        "id": "bonus-spend",
        "title": "Discretionary Bonuses & Stipas",
        "description": "Zero discretionary bonuses were processed in the current calendar quarter."
      },
      {
        "id": "contractors",
        "title": "External Contractor Payouts",
        "description": "Contractor invoices processed through payroll total ₦1,200,000 this quarter."
      }
    ]
  }
}
```

---

## 2. Recurring Payroll Schedules Management

Manages recurring automated payroll schedules (listing, configuring, and deleting scheduled disbursements) for corporate staff and departments. This powers the Payroll Schedules view (`/org/payroll/schedules`).

### 2.1 List Payroll Schedules
Retrieves all active and upcoming automated payroll schedules configured for the organization.

* **Method**: `GET`
* **Route**: `/api/v1/org/payroll/schedules`
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`
* **Query Parameters**:
  * `pageNumber` (`integer`, optional, default: `1`): 1-based page number.
  * `pageSize` (`integer`, optional, default: `20`): Records per page.
  * `departmentId` (`string (UUID)`, optional): Filter by target department.

#### Expected Response (`200 OK`)
```json
{
  "items": [
    {
      "id": "7b6b19cf-9382-4fa6-8f3b-5517f8a75e21",
      "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",
      "description": "Monthly Engineering Staff Payout",
      "disbursementDay": 25,
      "disbursementFrequency": "Monthly",
      "amount": 50000.00,
      "currency": "NGN",
      "departmentId": "889e88ed-3c5c-4b05-bb92-adb28262a2e5",
      "departmentName": "Engineering",
      "activeStaffCount": 14,
      "nextRunDateUtc": "2026-09-25T00:00:00Z",
      "status": "Active"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1,
  "hasPreviousPage": false,
  "hasNextPage": false
}
```

### 2.2 Create Recurring Schedule
Creates a recurring automated payroll schedule.

* **Method**: `POST`
* **Route**: `/api/v1/org/payroll/schedules`
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`

#### Expected Request Body
```json
{
  "description": "Monthly Marketing Staff Payout",
  "disbursementDay": 28,
  "disbursementFrequency": "Monthly",
  "amount": 250000.00,
  "currency": "NGN",
  "departmentId": "889e88ed-3c5c-4b05-bb92-adb28262a2e5"
}
```

#### Expected Response (`201 Created`)
```json
{
  "id": "7b6b19cf-9382-4fa6-8f3b-5517f8a75e21",
  "message": "Payroll schedule created successfully."
}
```

### 2.3 Delete / Deactivate Schedule
Cancels or deletes an existing automated recurring schedule.

* **Method**: `DELETE`
* **Route**: `/api/v1/org/payroll/schedules/{id}`
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`

#### Expected Response (`200 OK`)
```json
{
  "success": true,
  "message": "Payroll schedule deleted successfully."
}
```

---

## 3. Composite Department + Workforce Roles Creation

Atomically creates a corporate department and registers its initial collection of workforce roles in a single transactional request. This matches the Create Department modal where the user defines the department name and enters multiple role chips simultaneously.

* **Method**: `POST`
* **Route**: `/api/v1/org/departments/with-roles` (or accept optional `roles` array on existing `POST /api/v1/org/departments`)
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`

### Expected Request Body
```json
{
  "name": "UI/UX Design",
  "description": "Product Design and User Experience",
  "roles": [
    "UI/UX Intern",
    "Entry Level Designer",
    "Mid Level Designer",
    "Senior Product Designer"
  ]
}
```

### Expected Response (`201 Created`)
```json
{
  "id": "889e88ed-3c5c-4b05-bb92-adb28262a2e5",
  "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",
  "name": "UI/UX Design",
  "description": "Product Design and User Experience",
  "roles": [
    {
      "id": "90e2b9c7-5cf7-4f6c-b3a1-778899aabbcc",
      "title": "UI/UX Intern"
    },
    {
      "id": "a1f3c8d8-6df8-4e7d-c4b2-8899aabbccdd",
      "title": "Entry Level Designer"
    },
    {
      "id": "b2e4d9e9-7ef9-4f8e-d5c3-99aabbccddee",
      "title": "Mid Level Designer"
    },
    {
      "id": "c3f5eaf0-8fa0-4a9f-e6d4-aabbccddeeff",
      "title": "Senior Product Designer"
    }
  ],
  "createdAtUtc": "2026-09-19T14:50:00Z"
}
```

---

## 4. Composite Salary Level + Staff Member Assignments

Atomically creates a salary level tier and assigns an initial group of staff members to that tier in a single transactional request. This matches the Create Level modal where the user specifies the level name, base salary amount, currency, and assigned member chips.

* **Method**: `POST`
* **Route**: `/api/v1/org/levels/with-members` (or accept optional `memberUserIds` / `staffMembershipIds` array on existing `POST /api/v1/org/levels`)
* **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <UUID>`

### Expected Request Body
```json
{
  "levelName": "Level 10",
  "baseAmount": 500000.00,
  "currency": "NGN",
  "staffMembershipIds": [
    "01f73c76-dfed-4838-901a-04400e042283",
    "78f6c78f-4c89-4981-b45c-f48b2ef82cea"
  ]
}
```

### Expected Response (`201 Created`)
```json
{
  "id": "8c56a0c8-8f61-44d7-850d-88cdb93d7b71",
  "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",
  "levelName": "Level 10",
  "baseAmount": 500000.00,
  "currency": "NGN",
  "assignedStaffCount": 2,
  "createdAtUtc": "2026-09-19T14:50:00Z"
}
```
