# CebizPay Frontend Agent Guidelines

## 1. Domain Enums & Data Consistency (`src/data/enums.js`)

All domain types, status codes, roles, frequencies, and currencies **MUST** be imported directly from [`src/data/enums.js`](file:///src/data/enums.js). Never hardcode numbers or invent custom status strings.

* **Import Both Formats**: Use string constants (e.g., `Currency.NGN`, `SavingsPlanType.GoalBased`) or numeric values (e.g., `CurrencyValues.NGN`, `EmploymentTypeValues.FullTime`).
* **Numeric vs. String Serialization**: Form dropdowns may display labels like `'Full-time'` or `'Bi-weekly'`, but API payloads **must** be PascalCase enum strings (`'FullTime'`, `'BiWeekly'`) or their integers (`0`, `3`).
* **Check Enum Indexing**: Most enums are **1-based** (`Currency.NGN = 1`, `0` is invalid). Some are **0-based** (`EmploymentType.FullTime = 0`). Always verify in `enums.js`.
* **Transaction Status is `Completed`**: Canonical terminal success status for transfers, transactions, and payroll is `'Completed'`. Do not use `'Successful'`.
* **Preset Filter Options**: When rendering `<FilterDropdown />`, always pass domain-specific presets from `FilterDropdown.jsx` (`MEMBERSHIP_STATUS_FILTER_OPTIONS`, `TRANSACTION_STATUS_FILTER_OPTIONS`, etc.).
* **Individual KYC vs. Suspension**:
  * KYC updates (`/kyc-status`) only accept `Verified (2)` or `Rejected (3)`.
  * Account suspension/reactivation uses `adminService.individuals.suspend(id, { reason })` and `reactivate(id, { reason })`. The `reason` is mandatory ($\ge 5$ characters).
* **Roles & Permissions**: Use `MembershipRoleType` (`Owner: 1, Admin: 2, Member: 3, PayrollManager: 4, HrManager: 5`) and `usePermissions()` helpers instead of arbitrary role strings.

## 2. Code Comments & Clean Implementation Guidelines

* **No Unnecessary Comments**: Never write obvious, redundant, or verbose explanatory comments in the codebase.
* **Concise & Specific Only**: Use only essential, specific comments when explaining non-obvious business logic, edge cases, or complex calculations.
* **No Chat/Conversation References**: Never reference user prompts, assistant discussions, task instructions, or chat dialogue in code comments, file headers, or docstrings. Code must remain clean, professional, and production-ready.
