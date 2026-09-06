const API_VERSION = 'v1';
const BASE_PREFIX = `/api/${API_VERSION}`;

export const ENDPOINTS = {
  // Authentication & Session
  AUTH: {
    LOGIN: `${BASE_PREFIX}/auth/login`,
    MFA_VERIFY: `${BASE_PREFIX}/auth/mfa/verify`,
    MFA_TOGGLE: `${BASE_PREFIX}/auth/mfa/toggle`,
    REGISTER_PHONE: `${BASE_PREFIX}/auth/register/phone`,
    REGISTER_OTP_VERIFY: `${BASE_PREFIX}/auth/register/otp/verify`,
    CHANGE_PASSWORD: `${BASE_PREFIX}/auth/change-password`,
    ADMIN_REDEEM_INVITE: `${BASE_PREFIX}/auth/admin/redeem-invite`,
    REFRESH_TOKEN: `${BASE_PREFIX}/auth/refresh-token`,
    REVOKE_TOKEN: `${BASE_PREFIX}/auth/revoke-token`,
  },

  // User Profile, Referrals & Notifications
  USER: {
    REFERRALS: {
      DASHBOARD: `${BASE_PREFIX}/profile/referrals`,
      GET_OR_CREATE_CODE: `${BASE_PREFIX}/profile/referrals/code`,
      CLAIM_CODE: `${BASE_PREFIX}/profile/referrals/claim`,
    },
    NOTIFICATIONS: {
      LIST: `${BASE_PREFIX}/notifications`,
      UNREAD_COUNT: `${BASE_PREFIX}/notifications/unread-count`,
      MARK_READ: (id) => `${BASE_PREFIX}/notifications/${id}/read`,
      MARK_ALL_READ: `${BASE_PREFIX}/notifications/read-all`,
      PREFERENCES: `${BASE_PREFIX}/notifications/preferences`,
      REGISTER_DEVICE: `${BASE_PREFIX}/notifications/device-token`,
    },
    ANNOUNCEMENTS: {
      ACTIVE: `${BASE_PREFIX}/announcements/active`,
      LIST: `${BASE_PREFIX}/announcements`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/announcements/${id}`,
    },
  },

  // Individual KYC & Business KYB & Compliance Verification
  COMPLIANCE: {
    INDIVIDUAL_KYC: {
      SUBMIT: (id) => `${BASE_PREFIX}/individuals/${id}/kyc-documents`,
      LIST: (id) => `${BASE_PREFIX}/individuals/${id}/kyc-documents`,
      UPDATE_STATUS: (id) => `${BASE_PREFIX}/individuals/${id}/kyc-status`,
    },
    KYB: {
      REGISTER_STEP1: `${BASE_PREFIX}/org/kyb/register-step1`,
      REGISTER_STEP2: `${BASE_PREFIX}/org/kyb/register-step2`,
      UPDATE_STATUS: (id) => `${BASE_PREFIX}/organizations/${id}/status`,
    },
    IDENTITY_VERIFICATION: {
      VERIFY_BVN: `${BASE_PREFIX}/compliance/verify/bvn`,
      VERIFY_NIN: `${BASE_PREFIX}/compliance/verify/nin`,
      VERIFY_BUSINESS: `${BASE_PREFIX}/compliance/verify/business`,
      VERIFY_DOCUMENT: `${BASE_PREFIX}/compliance/verify/document`,
      VERIFY_BIOMETRICS: `${BASE_PREFIX}/compliance/verify/biometrics`,
      SCREEN_AML: `${BASE_PREFIX}/compliance/screen/aml`,
      ELIGIBILITY: `${BASE_PREFIX}/compliance/eligibility/check`,
      CDD_PROFILE: `${BASE_PREFIX}/compliance/cdd/profile`,
      SUBMIT_EDD_INFO: (caseId) => `${BASE_PREFIX}/compliance/edd/cases/${caseId}/information`,
      BENEFICIAL_OWNERS: `${BASE_PREFIX}/compliance/beneficial-owners`,
    },
  },

  // Wallet & Virtual Accounts
  WALLET: {
    DETAILS: `${BASE_PREFIX}/wallet`,
    TRANSACTIONS: `${BASE_PREFIX}/wallet/transactions`,
    PEER_TRANSFER: `${BASE_PREFIX}/wallet/transfer/peer`,
    BANK_TRANSFER: `${BASE_PREFIX}/wallet/transfer/bank`,
    VIRTUAL_ACCOUNTS: {
      PROVISION: `${BASE_PREFIX}/virtual-accounts`,
      LIST: `${BASE_PREFIX}/virtual-accounts`,
    },
  },

  // Card Management & Funding
  CARDS: {
    SAVED_CARDS: `${BASE_PREFIX}/saved-cards`,
    GET_BY_ID: (id) => `${BASE_PREFIX}/saved-cards/${id}`,
    DELETE_CARD: (id) => `${BASE_PREFIX}/saved-cards/${id}`,
    SET_DEFAULT: (id) => `${BASE_PREFIX}/saved-cards/${id}/default`,
    CHARGE_SAVED_CARD: `${BASE_PREFIX}/saved-cards/charge`,
    FUNDING: {
      INITIALIZE: `${BASE_PREFIX}/card-funding/initialize`,
      VERIFY: `${BASE_PREFIX}/card-funding/verify`,
      STATUS: (reference) => `${BASE_PREFIX}/card-funding/status/${reference}`,
    },
    VERIFICATION: {
      INITIALIZE: `${BASE_PREFIX}/card-verification/initialize`,
      COMPLETE: `${BASE_PREFIX}/card-verification/complete`,
    },
    REFUNDS: {
      REQUEST: `${BASE_PREFIX}/card-refunds/request`,
      LIST: `${BASE_PREFIX}/card-refunds`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/card-refunds/${id}`,
    },
  },

  // Savings & Investments
  SAVINGS: {
    PLANS: `${BASE_PREFIX}/savings/plans`,
    PLAN_BY_ID: (id) => `${BASE_PREFIX}/savings/plans/${id}`,
    PREVIEW: `${BASE_PREFIX}/savings/preview`,
    OPEN_ACCOUNT: `${BASE_PREFIX}/savings/accounts`,
    GET_ACCOUNTS: `${BASE_PREFIX}/savings/accounts`,
    ACCOUNT_BY_ID: (id) => `${BASE_PREFIX}/savings/accounts/${id}`,
    CONTRIBUTE: (id) => `${BASE_PREFIX}/savings/accounts/${id}/contribute`,
    WITHDRAW: (id) => `${BASE_PREFIX}/savings/accounts/${id}/withdraw`,
    STAFF_SAVINGS: {
      PLANS: `${BASE_PREFIX}/staff/savings/plans`,
      ACCOUNTS: `${BASE_PREFIX}/staff/savings/accounts`,
      OPEN: `${BASE_PREFIX}/staff/savings/accounts`,
      CONTRIBUTE: (id) => `${BASE_PREFIX}/staff/savings/accounts/${id}/contribute`,
      WITHDRAW: (id) => `${BASE_PREFIX}/staff/savings/accounts/${id}/withdraw`,
    },
    ORG_SAVINGS: {
      PLANS: `${BASE_PREFIX}/org/savings/plans`,
      ACCOUNTS: `${BASE_PREFIX}/org/savings/accounts`,
      CREATE_PLAN: `${BASE_PREFIX}/org/savings/plans`,
    },
  },

  // Thrift / Esusu
  THRIFT: {
    GROUPS: `${BASE_PREFIX}/thrift/groups`,
    GET_GROUP: (id) => `${BASE_PREFIX}/thrift/groups/${id}`,
    CREATE_GROUP: `${BASE_PREFIX}/thrift/groups`,
    PAUSE_GROUP: (id) => `${BASE_PREFIX}/thrift/groups/${id}/pause`,
    INVITE_MEMBER: (id) => `${BASE_PREFIX}/thrift/groups/${id}/invitations`,
    ACCEPT_INVITATION: (id) => `${BASE_PREFIX}/thrift/groups/${id}/invitations/accept`,
    SELECT_POSITION: (id) => `${BASE_PREFIX}/thrift/groups/${id}/positions`,
    REMOVE_MEMBER: (groupId, memberId) => `${BASE_PREFIX}/thrift/groups/${groupId}/members/${memberId}`,
    DISPUTES: {
      CREATE: (id) => `${BASE_PREFIX}/thrift/groups/${id}/disputes`,
      LIST: (id) => `${BASE_PREFIX}/thrift/groups/${id}/disputes`,
      RESOLVE: (groupId, disputeId) => `${BASE_PREFIX}/thrift/groups/${groupId}/disputes/${disputeId}/resolve`,
    },
    STAFF_THRIFT: {
      GROUPS: `${BASE_PREFIX}/staff/thrift/groups`,
      JOIN: (id) => `${BASE_PREFIX}/staff/thrift/groups/${id}/join`,
      ACCEPT_INVITE: (id) => `${BASE_PREFIX}/staff/thrift/groups/${id}/invitations/accept`,
    },
    ORG_THRIFT: {
      GROUPS: `${BASE_PREFIX}/org/thrift/groups`,
      CREATE: `${BASE_PREFIX}/org/thrift/groups`,
    },
  },

  // Loans & Credit Facilities
  LOANS: {
    PLANS: `${BASE_PREFIX}/loans/plans`,
    CALCULATE_PREVIEW: `${BASE_PREFIX}/loans/calculate`,
    APPLICATIONS: `${BASE_PREFIX}/loans/applications`,
    APPLICATION_BY_ID: (id) => `${BASE_PREFIX}/loans/applications/${id}`,
    SUBMIT_APPLICATION: `${BASE_PREFIX}/loans/applications`,
    CONTRACTS: `${BASE_PREFIX}/loans/contracts`,
    CONTRACT_BY_ID: (id) => `${BASE_PREFIX}/loans/contracts/${id}`,
    REPAYMENT_SCHEDULE: (contractId) => `${BASE_PREFIX}/loans/contracts/${contractId}/schedule`,
    STAFF_LOANS: {
      PLANS: `${BASE_PREFIX}/staff/loans/plans`,
      APPLICATIONS: `${BASE_PREFIX}/staff/loans/applications`,
      SUBMIT: `${BASE_PREFIX}/staff/loans/applications`,
      CONVERT: `${BASE_PREFIX}/staff/loans/convert`,
    },
    ORG_LOANS: {
      CORPORATE_PLANS: `${BASE_PREFIX}/corporate-loan-plans`,
      CREATE_CORPORATE_PLAN: `${BASE_PREFIX}/corporate-loan-plans`,
      APPLICATIONS: `${BASE_PREFIX}/org/loans/applications`,
      APPROVE_APPLICATION: (id) => `${BASE_PREFIX}/org/loans/applications/${id}/approve`,
      DECLINE_APPLICATION: (id) => `${BASE_PREFIX}/org/loans/applications/${id}/decline`,
    },
  },

  // VAS (Value Added Services)
  VAS: {
    NETWORKS: `${BASE_PREFIX}/vas/networks`,
    DETECT_OPERATOR: `${BASE_PREFIX}/vas/detect-operator`,
    DATA_BUNDLES: (network) => `${BASE_PREFIX}/vas/data-bundles/${network}`,
    PURCHASE_AIRTIME: `${BASE_PREFIX}/vas/airtime`,
    PURCHASE_DATA: `${BASE_PREFIX}/vas/data`,
  },

  // Organization Workforce & Structure
  ORGANIZATION: {
    DEPARTMENTS: {
      LIST: `${BASE_PREFIX}/departments`,
      CREATE: `${BASE_PREFIX}/departments`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/departments/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/departments/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/departments/${id}`,
    },
    WORKFORCE_ROLES: {
      LIST: `${BASE_PREFIX}/workforce-roles`,
      CREATE: `${BASE_PREFIX}/workforce-roles`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/workforce-roles/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/workforce-roles/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/workforce-roles/${id}`,
    },
    SALARY_LEVELS: {
      LIST: `${BASE_PREFIX}/salary-levels`,
      CREATE: `${BASE_PREFIX}/salary-levels`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/salary-levels/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/salary-levels/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/salary-levels/${id}`,
    },
    STAFF: {
      LIST: `${BASE_PREFIX}/staff`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/staff/${id}`,
      CREATE_DIRECT: `${BASE_PREFIX}/staff/direct`,
      INVITE: `${BASE_PREFIX}/staff/invite`,
      INVITE_BULK: `${BASE_PREFIX}/staff/invite/bulk`,
      ACCEPT_INVITATION: `${BASE_PREFIX}/staff/invitations/accept`,
      ASSIGN_WORKFORCE: (id) => `${BASE_PREFIX}/staff/${id}/workforce`,
      SUSPEND: (id) => `${BASE_PREFIX}/staff/${id}/suspend`,
      TERMINATE: (id) => `${BASE_PREFIX}/staff/${id}/terminate`,
    },
  },

  // Payroll Management
  PAYROLL: {
    CALCULATE: `${BASE_PREFIX}/payroll/calculate`,
    EXECUTE: `${BASE_PREFIX}/payroll/execute`,
    RUNS: `${BASE_PREFIX}/payroll/runs`,
    RUN_BY_ID: (id) => `${BASE_PREFIX}/payroll/runs/${id}`,
    REPORTS: `${BASE_PREFIX}/payroll/reports`,
  },

  // ERP Operations (Inventory, Orders, Invoices, Expenses, Services, Suppliers, Customers)
  ERP: {
    INVENTORY: {
      ITEMS: `${BASE_PREFIX}/org/inventory/items`,
      GET_ITEM: (id) => `${BASE_PREFIX}/org/inventory/items/${id}`,
      CREATE_ITEM: `${BASE_PREFIX}/org/inventory/items`,
      UPDATE_ITEM: (id) => `${BASE_PREFIX}/org/inventory/items/${id}`,
      STOCK_IN: (id) => `${BASE_PREFIX}/org/inventory/items/${id}/stock-in`,
      STOCK_OUT: (id) => `${BASE_PREFIX}/org/inventory/items/${id}/stock-out`,
      STOCK_ADJUSTMENT: (id) => `${BASE_PREFIX}/org/inventory/items/${id}/adjust`,
      STOCK_MOVEMENTS: `${BASE_PREFIX}/org/inventory/movements`,
      VALUATION_POLICY: `${BASE_PREFIX}/org/inventory/valuation-policy`,
    },
    PURCHASE_ORDERS: {
      LIST: `${BASE_PREFIX}/org/orders/purchase`,
      CREATE: `${BASE_PREFIX}/org/orders/purchase`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/orders/purchase/${id}`,
      RECEIVE_ITEM: (orderId, itemId) => `${BASE_PREFIX}/org/orders/purchase/${orderId}/items/${itemId}/receive`,
    },
    SALES_ORDERS: {
      LIST: `${BASE_PREFIX}/org/orders/sales`,
      CREATE: `${BASE_PREFIX}/org/orders/sales`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/orders/sales/${id}`,
      FULFILL_ITEM: (orderId, itemId) => `${BASE_PREFIX}/org/orders/sales/${orderId}/items/${itemId}/fulfill`,
    },
    INVOICES: {
      LIST: `${BASE_PREFIX}/org/invoices`,
      CREATE: `${BASE_PREFIX}/org/invoices`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/invoices/${id}`,
      RECORD_PAYMENT: (id) => `${BASE_PREFIX}/org/invoices/${id}/payments`,
    },
    RECEIPTS: {
      LIST: `${BASE_PREFIX}/org/receipts`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/receipts/${id}`,
    },
    EXPENSES: {
      OPERATING: {
        LIST: `${BASE_PREFIX}/org/expenses/operating`,
        CREATE: `${BASE_PREFIX}/org/expenses/operating`,
        GET_BY_ID: (id) => `${BASE_PREFIX}/org/expenses/operating/${id}`,
        PAY: (id) => `${BASE_PREFIX}/org/expenses/operating/${id}/pay`,
      },
      VOUCHERS: {
        LIST: `${BASE_PREFIX}/org/company-vouchers`,
        CREATE: `${BASE_PREFIX}/org/company-vouchers`,
        GET_BY_ID: (id) => `${BASE_PREFIX}/org/company-vouchers/${id}`,
        PAY: (id) => `${BASE_PREFIX}/org/company-vouchers/${id}/pay`,
        UPDATE_METADATA: (id) => `${BASE_PREFIX}/org/company-vouchers/${id}/metadata`,
      },
    },
    SUPPLIERS: {
      LIST: `${BASE_PREFIX}/org/suppliers`,
      CREATE: `${BASE_PREFIX}/org/suppliers`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/suppliers/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/org/suppliers/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/org/suppliers/${id}`,
    },
    CUSTOMERS: {
      LIST: `${BASE_PREFIX}/org/customers`,
      CREATE: `${BASE_PREFIX}/org/customers`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/customers/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/org/customers/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/org/customers/${id}`,
    },
    SERVICES: {
      LIST: `${BASE_PREFIX}/org/services`,
      CREATE: `${BASE_PREFIX}/org/services`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/services/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/org/services/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/org/services/${id}`,
    },
    REPORTS: {
      PROFIT_LOSS: `${BASE_PREFIX}/org/reports/profit-loss`,
      SALES: `${BASE_PREFIX}/org/reports/sales`,
      PURCHASES: `${BASE_PREFIX}/org/reports/purchases`,
      SETTLEMENT: `${BASE_PREFIX}/org/reports/settlement`,
    },
  },

  // Recruitment
  RECRUITMENT: {
    JOBS: {
      LIST: `${BASE_PREFIX}/org/recruitment/jobs`,
      CREATE: `${BASE_PREFIX}/org/recruitment/jobs`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/recruitment/jobs/${id}`,
      UPDATE: (id) => `${BASE_PREFIX}/org/recruitment/jobs/${id}`,
    },
    APPLICATIONS: {
      LIST_FOR_JOB: (jobId) => `${BASE_PREFIX}/org/recruitment/jobs/${jobId}/applications`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/org/recruitment/applications/${id}`,
      SHORTLIST: (id) => `${BASE_PREFIX}/org/recruitment/applications/${id}/shortlist`,
      ACCEPT: (id) => `${BASE_PREFIX}/org/recruitment/applications/${id}/accept`,
      REJECT: (id) => `${BASE_PREFIX}/org/recruitment/applications/${id}/reject`,
    },
    PUBLIC: {
      LIST_JOBS: `${BASE_PREFIX}/public/recruitment/jobs`,
      GET_JOB: (id) => `${BASE_PREFIX}/public/recruitment/jobs/${id}`,
      SUBMIT_APPLICATION: `${BASE_PREFIX}/public/recruitment/applications`,
    },
  },

  // Support & Kola Chatbot
  SUPPORT: {
    TICKETS: {
      LIST: `${BASE_PREFIX}/support/tickets`,
      CREATE: `${BASE_PREFIX}/support/tickets`,
      GET_BY_ID: (id) => `${BASE_PREFIX}/support/tickets/${id}`,
      ADD_MESSAGE: (id) => `${BASE_PREFIX}/support/tickets/${id}/messages`,
      UPDATE_STATUS: (id) => `${BASE_PREFIX}/support/tickets/${id}/status`,
    },
    KOLA: {
      START_SESSION: `${BASE_PREFIX}/support/kola/session`,
      INTERACT: `${BASE_PREFIX}/support/kola/interact`,
    },
  },

  // Admin & Platform Management
  ADMIN: {
    AUDIT_LOGS: `${BASE_PREFIX}/admin/audit-logs`,
    COMPLIANCE: {
      ASSESSMENT: (subjectType, subjectId) => `${BASE_PREFIX}/admin/compliance/assessments/${subjectType}/${subjectId}`,
      ASSESSMENT_HISTORY: (subjectType, subjectId) => `${BASE_PREFIX}/admin/compliance/assessments/${subjectType}/${subjectId}/history`,
      EVALUATE_RISK: `${BASE_PREFIX}/admin/compliance/assessments/evaluate`,
      EDD_CASES: `${BASE_PREFIX}/admin/compliance/edd/cases`,
      EDD_CASE_BY_ID: (id) => `${BASE_PREFIX}/admin/compliance/edd/cases/${id}`,
      REQUEST_EDD_INFO: (id) => `${BASE_PREFIX}/admin/compliance/edd/cases/${id}/request-information`,
      ASSIGN_EDD_REVIEWER: (id) => `${BASE_PREFIX}/admin/compliance/edd/cases/${id}/assign`,
      APPROVE_EDD: (id) => `${BASE_PREFIX}/admin/compliance/edd/cases/${id}/approve`,
      REJECT_EDD: (id) => `${BASE_PREFIX}/admin/compliance/edd/cases/${id}/reject`,
      PLACE_RESTRICTION: `${BASE_PREFIX}/admin/compliance/restrictions`,
      RELEASE_RESTRICTION: (id) => `${BASE_PREFIX}/admin/compliance/restrictions/${id}/release`,
      APPLY_OVERRIDE: `${BASE_PREFIX}/admin/compliance/overrides`,
    },
    FEES: {
      POLICIES: `${BASE_PREFIX}/admin/fees/policies`,
      PLATFORM_POLICIES: `${BASE_PREFIX}/admin/fees/platform-policies`,
      BANK_TRANSFER_POLICIES: `${BASE_PREFIX}/admin/fees/bank-transfer-policies`,
    },
    MANAGE: {
      ADMINS: `${BASE_PREFIX}/admin/manage/admins`,
      INVITE: `${BASE_PREFIX}/admin/manage/invite`,
      TOGGLE_STATUS: (id) => `${BASE_PREFIX}/admin/manage/admins/${id}/status`,
      GRANT_PERMISSION: (id) => `${BASE_PREFIX}/admin/manage/admins/${id}/permissions/grant`,
      REVOKE_PERMISSION: (id) => `${BASE_PREFIX}/admin/manage/admins/${id}/permissions/revoke`,
    },
    RECONCILIATION: {
      RECORDS: `${BASE_PREFIX}/admin/reconciliation/records`,
      UNIFIED: `${BASE_PREFIX}/admin/reconciliation/unified`,
    },
    REFERRALS: {
      SETTINGS: `${BASE_PREFIX}/admin/referrals/settings`,
      UPDATE_SETTINGS: `${BASE_PREFIX}/admin/referrals/settings`,
    },
    SAVINGS_POLICIES: {
      POLICIES: `${BASE_PREFIX}/admin/savings-interest-policies`,
      CREATE: `${BASE_PREFIX}/admin/savings-interest-policies`,
    },
    THRIFT: {
      GROUPS: `${BASE_PREFIX}/admin/thrift/groups`,
      GROUP_BY_ID: (id) => `${BASE_PREFIX}/admin/thrift/groups/${id}`,
      DELINQUENCIES: `${BASE_PREFIX}/admin/thrift/delinquencies`,
      DISPUTES: `${BASE_PREFIX}/admin/thrift/disputes`,
      RESOLVE_DISPUTE: (id) => `${BASE_PREFIX}/admin/thrift/disputes/${id}/resolve`,
    },
    SUPPORT: {
      REPORTS: `${BASE_PREFIX}/admin/support/reports`,
      TICKETS: `${BASE_PREFIX}/admin/support/tickets`,
    },
    ANNOUNCEMENTS: {
      CREATE: `${BASE_PREFIX}/announcements`,
      UPDATE: (id) => `${BASE_PREFIX}/announcements/${id}`,
      DELETE: (id) => `${BASE_PREFIX}/announcements/${id}`,
    },
  },
};
