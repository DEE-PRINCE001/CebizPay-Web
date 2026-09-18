# CebizPay Domain Enums (`enums.js`)

Source of truth for all 120 backend domain enums.

## Quick Usage
```javascript
import { Currency, CurrencyValues, SavingsPlanType, MembershipStatus } from '@/data/enums.js';
```

## Core Rules
1. **Never guess values**: `Currency.NGN = 1` (1-based, `0` is invalid). `EmploymentType.FullTime = 0` (0-based).
2. **No hyphenated strings in API payloads**: Use PascalCase (`'FullTime'`, `'BiWeekly'`) or numeric values.
3. **Transaction terminal status**: Always use `'Completed'`, never `'Successful'`.
4. **Individual suspension**: Use dedicated endpoints (`adminService.individuals.suspend`/`reactivate` with $\ge 5$ char reason).
