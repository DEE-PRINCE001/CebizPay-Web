/**
 * CebizPay Application Domain Enums
 * Auto-generated with 100% precision from backend domain assemblies.
 *
 * Both numeric IDs and string literals are supported by the backend
 * (JsonStringEnumConverter enabled).
 */

/**
 * Lifecycle status of an administrative user invitation.
 * Namespace: CebizPay.Domain.Enums
 */
export const AdminInvitationStatus = Object.freeze({
  /** Invitation is active and awaiting redemption. (Integer: 1) */
  Pending: 'Pending',
  /** Invitation has been successfully redeemed and converted to an active admin profile. (Integer: 2) */
  Redeemed: 'Redeemed',
  /** Invitation was cancelled by a Super Admin before redemption. (Integer: 3) */
  Cancelled: 'Cancelled',
  /** Integer value: 4 */
  Expired: 'Expired',
});

/**
 * Numeric values for AdminInvitationStatus
 */
export const AdminInvitationStatusValues = Object.freeze({
  Pending: 1,
  Redeemed: 2,
  Cancelled: 3,
  Expired: 4,
});

/**
 * Administrative user role classification.
 * Namespace: CebizPay.Domain.Enums
 */
export const AdminRoleType = Object.freeze({
  /** Super admin role. (Integer: 1) */
  SuperAdmin: 'SuperAdmin',
  /** Standard admin role. (Integer: 2) */
  Admin: 'Admin',
  /** Integer value: 3 */
  Auditor: 'Auditor',
});

/**
 * Numeric values for AdminRoleType
 */
export const AdminRoleTypeValues = Object.freeze({
  SuperAdmin: 1,
  Admin: 2,
  Auditor: 3,
});

/**
 * Defines the target audience scope for an announcement.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const AnnouncementScope = Object.freeze({
  /** Global platform-wide announcement broadcast to all platform users. (Integer: 1) */
  Platform: 'Platform',
  /** Integer value: 2 */
  Workplace: 'Workplace',
});

/**
 * Numeric values for AnnouncementScope
 */
export const AnnouncementScopeValues = Object.freeze({
  Platform: 1,
  Workplace: 2,
});

/**
 * Publication lifecycle status for an announcement.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const AnnouncementStatus = Object.freeze({
  /** Announcement created but not yet published or publicly visible. (Integer: 1) */
  Draft: 'Draft',
  /** Announcement published and publicly visible to its target audience. (Integer: 2) */
  Published: 'Published',
  /** Integer value: 3 */
  Archived: 'Archived',
});

/**
 * Numeric values for AnnouncementStatus
 */
export const AnnouncementStatusValues = Object.freeze({
  Draft: 1,
  Published: 2,
  Archived: 3,
});

/**
 * Represents the candidate application review lifecycle status.
 * Namespace: CebizPay.Domain.Enums
 */
export const ApplicationStatus = Object.freeze({
  /** Application submitted and awaiting initial review. (Integer: 0) */
  Submitted: 'Submitted',
  /** Application currently being reviewed by hiring manager / HR. (Integer: 1) */
  UnderReview: 'UnderReview',
  /** Candidate application shortlisted for interviews / offer. (Integer: 2) */
  Shortlisted: 'Shortlisted',
  /** Application rejected. (Integer: 3) */
  Rejected: 'Rejected',
  /** Candidate accepted / offer extended. (Integer: 4) */
  Accepted: 'Accepted',
  /** Integer value: 5 */
  Withdrawn: 'Withdrawn',
});

/**
 * Numeric values for ApplicationStatus
 */
export const ApplicationStatusValues = Object.freeze({
  Submitted: 0,
  UnderReview: 1,
  Shortlisted: 2,
  Rejected: 3,
  Accepted: 4,
  Withdrawn: 5,
});

/**
 * Status lifecycle of an outbound bank transfer financial operation.   State Machine:  Pending -> Processing -> Completed | Failed | Unknown  Pending -> Failed | Unknown  Processing -> Completed | Failed | Unknown  Unknown -> Completed | Failed
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const BankTransferStatus = Object.freeze({
  /** Financial transaction accepted by CebizPay and funds immediately debited from sender wallet into clearing account.      External provider execution has not yet reached a final state. (Integer: 1) */
  Pending: 'Pending',
  /** External execution is actively in-flight with the external provider/network. (Integer: 2) */
  Processing: 'Processing',
  /** External bank transfer confirmed successful. Terminal state. (Integer: 3) */
  Completed: 'Completed',
  /** External bank transfer definitively unsuccessful. Terminal state.      Funds are restored to sender wallet via an atomic reversal transaction. (Integer: 4) */
  Failed: 'Failed',
  /** Integer value: 5 */
  Unknown: 'Unknown',
});

/**
 * Numeric values for BankTransferStatus
 */
export const BankTransferStatusValues = Object.freeze({
  Pending: 1,
  Processing: 2,
  Completed: 3,
  Failed: 4,
  Unknown: 5,
});

/**
 * Execution status of a card refund operation.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const CardRefundStatus = Object.freeze({
  /** Refund initiated and awaiting provider execution. (Integer: 1) */
  Pending: 'Pending',
  /** Refund confirmed successful and double-entry ledger reversed. (Integer: 2) */
  Succeeded: 'Succeeded',
  /** Refund rejected by provider. (Integer: 3) */
  Failed: 'Failed',
  /** Integer value: 4 */
  RecoveryOutstanding: 'RecoveryOutstanding',
});

/**
 * Numeric values for CardRefundStatus
 */
export const CardRefundStatusValues = Object.freeze({
  Pending: 1,
  Succeeded: 2,
  Failed: 3,
  RecoveryOutstanding: 4,
});

/**
 * Status of a card zero-auth or micro-charge verification operation.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const CardVerificationStatus = Object.freeze({
  /** Verification session initialized with provider. (Integer: 1) */
  Pending: 'Pending',
  /** Card successfully authenticated, tokenized, and verified. (Integer: 2) */
  Verified: 'Verified',
  /** Verification failed or rejected by issuing bank/provider. (Integer: 3) */
  Failed: 'Failed',
  /** Integer value: 4 */
  Refunded: 'Refunded',
});

/**
 * Numeric values for CardVerificationStatus
 */
export const CardVerificationStatusValues = Object.freeze({
  Pending: 1,
  Verified: 2,
  Failed: 3,
  Refunded: 4,
});

/**
 * Regulatory Customer Due Diligence (CDD) depth level as defined by CBN Regulations.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const CddLevel = Object.freeze({
  /** Simplified / Basic CDD applied to low-risk relationships (Tier 1 Individual). (Integer: 1) */
  Basic: 'Basic',
  /** Standard CDD applied to standard-risk individuals and verified corporate entities. (Integer: 2) */
  Standard: 'Standard',
  /** Integer value: 3 */
  Enhanced: 'Enhanced',
});

/**
 * Numeric values for CddLevel
 */
export const CddLevelValues = Object.freeze({
  Basic: 1,
  Standard: 2,
  Enhanced: 3,
});

/**
 * Lifecycle status of Customer Due Diligence (CDD) for a subject.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const CddStatus = Object.freeze({
  /** CDD has not yet been initiated. (Integer: 1) */
  NotStarted: 'NotStarted',
  /** CDD verification and risk evaluation is currently in progress. (Integer: 2) */
  InProgress: 'InProgress',
  /** CDD has successfully completed with sufficient verifiable evidence. (Integer: 3) */
  Completed: 'Completed',
  /** CDD requires Enhanced Due Diligence (EDD) escalation before full clearance. (Integer: 4) */
  EnhancedRequired: 'EnhancedRequired',
  /** CDD requires manual review by a compliance officer due to flagged risks. (Integer: 5) */
  ReviewRequired: 'ReviewRequired',
  /** Integer value: 6 */
  Suspended: 'Suspended',
});

/**
 * Numeric values for CddStatus
 */
export const CddStatusValues = Object.freeze({
  NotStarted: 1,
  InProgress: 2,
  Completed: 3,
  EnhancedRequired: 4,
  ReviewRequired: 5,
  Suspended: 6,
});

/**
 * Settlement method for an ERP company disbursement voucher.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const CompanyVoucherPaymentMethod = Object.freeze({
  /** Manual or external payment (no internal wallet/ledger mutation). (Integer: 0) */
  Manual: 'Manual',
  /** Integer value: 1 */
  Wallet: 'Wallet',
});

/**
 * Numeric values for CompanyVoucherPaymentMethod
 */
export const CompanyVoucherPaymentMethodValues = Object.freeze({
  Manual: 0,
  Wallet: 1,
});

/**
 * Lifecycle status of an ERP company disbursement voucher.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const CompanyVoucherStatus = Object.freeze({
  /** Voucher created as draft. (Integer: 0) */
  Draft: 'Draft',
  /** Voucher approved for payment/disbursement. (Integer: 1) */
  Approved: 'Approved',
  /** Voucher financially settled / paid. (Integer: 2) */
  Paid: 'Paid',
  /** Integer value: 3 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for CompanyVoucherStatus
 */
export const CompanyVoucherStatusValues = Object.freeze({
  Draft: 0,
  Approved: 1,
  Paid: 2,
  Cancelled: 3,
});

/**
 * Authoritative compliance decision produced by the CebizPay Compliance Decision Engine.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const ComplianceDecisionType = Object.freeze({
  /** Account / relationship approved for standard financial operations. (Integer: 1) */
  Approved: 'Approved',
  /** Account placed in review requiring manual compliance sign-off. (Integer: 2) */
  ReviewRequired: 'ReviewRequired',
  /** Account requires completion of Enhanced Due Diligence (EDD) workflow. (Integer: 3) */
  EddRequired: 'EddRequired',
  /** Account restricted with specific operational or volume caps. (Integer: 4) */
  Restricted: 'Restricted',
  /** Account rejected for compliance or regulatory failure. (Integer: 5) */
  Rejected: 'Rejected',
  /** Integer value: 6 */
  Suspended: 'Suspended',
});

/**
 * Numeric values for ComplianceDecisionType
 */
export const ComplianceDecisionTypeValues = Object.freeze({
  Approved: 1,
  ReviewRequired: 2,
  EddRequired: 3,
  Restricted: 4,
  Rejected: 5,
  Suspended: 6,
});

/**
 * Financial operation categories evaluated for compliance eligibility.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const ComplianceOperationType = Object.freeze({
  /** Outbound bank transfer / payout via NIP. (Integer: 1) */
  BankTransferPayout: 'BankTransferPayout',
  /** Inbound card funding. (Integer: 2) */
  CardFunding: 'CardFunding',
  /** Inbound virtual account deposit. (Integer: 3) */
  VirtualAccountFunding: 'VirtualAccountFunding',
  /** Internal wallet peer-to-peer transfer. (Integer: 4) */
  PeerTransfer: 'PeerTransfer',
  /** Corporate payroll disbursement. (Integer: 5) */
  SalaryDisbursement: 'SalaryDisbursement',
  /** Integer value: 6 */
  VasPurchase: 'VasPurchase',
});

/**
 * Numeric values for ComplianceOperationType
 */
export const ComplianceOperationTypeValues = Object.freeze({
  BankTransferPayout: 1,
  CardFunding: 2,
  VirtualAccountFunding: 3,
  PeerTransfer: 4,
  SalaryDisbursement: 5,
  VasPurchase: 6,
});

/**
 * Types of granular compliance restrictions applied to a subject's financial activity.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const ComplianceRestrictionType = Object.freeze({
  /** Blocks all outbound money movement (transfers, payouts, disbursements). (Integer: 1) */
  BlockAllOutbound: 'BlockAllOutbound',
  /** Blocks external NIP bank transfers / payouts only. (Integer: 2) */
  BlockBankTransfer: 'BlockBankTransfer',
  /** Blocks inbound card funding operations. (Integer: 3) */
  BlockCardFunding: 'BlockCardFunding',
  /** Blocks dedicated virtual account funding. (Integer: 4) */
  BlockVirtualAccount: 'BlockVirtualAccount',
  /** Enforces a maximum cumulative daily transaction volume cap. (Integer: 5) */
  CapDailyVolume: 'CapDailyVolume',
  /** Enforces a maximum single transaction amount cap. (Integer: 6) */
  CapSingleTransaction: 'CapSingleTransaction',
  /** Integer value: 7 */
  FullAccountSuspension: 'FullAccountSuspension',
});

/**
 * Numeric values for ComplianceRestrictionType
 */
export const ComplianceRestrictionTypeValues = Object.freeze({
  BlockAllOutbound: 1,
  BlockBankTransfer: 2,
  BlockCardFunding: 3,
  BlockVirtualAccount: 4,
  CapDailyVolume: 5,
  CapSingleTransaction: 6,
  FullAccountSuspension: 7,
});

/**
 * Processing lifecycle state of an inbound compliance verification webhook event.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const ComplianceWebhookEventStatus = Object.freeze({
  /** Received and persisted at webhook gateway. (Integer: 1) */
  Received: 'Received',
  /** Asynchronously processed and evidence recorded. (Integer: 2) */
  Processed: 'Processed',
  /** Duplicate delivery safely acknowledged. (Integer: 3) */
  Duplicate: 'Duplicate',
  /** Ignored (e.g. unhandled event type). (Integer: 4) */
  Ignored: 'Ignored',
  /** Processing failed with an error. (Integer: 5) */
  Failed: 'Failed',
  /** Event actively claimed and being processed by a worker. (Integer: 6) */
  Processing: 'Processing',
  /** Callback status is ambiguous; scheduled for status re-query. (Integer: 7) */
  RequiresReconciliation: 'RequiresReconciliation',
  /** Discrepancy detected; requires manual compliance officer review. (Integer: 8) */
  ManualReview: 'ManualReview',
  /** Integer value: 9 */
  DeadLetter: 'DeadLetter',
});

/**
 * Numeric values for ComplianceWebhookEventStatus
 */
export const ComplianceWebhookEventStatusValues = Object.freeze({
  Received: 1,
  Processed: 2,
  Duplicate: 3,
  Ignored: 4,
  Failed: 5,
  Processing: 6,
  RequiresReconciliation: 7,
  ManualReview: 8,
  DeadLetter: 9,
});

/**
 * Status outcome of processing an inbound compliance webhook payload.
 * Namespace: CebizPay.Application.Common.Interfaces.Compliance
 */
export const ComplianceWebhookProcessingStatus = Object.freeze({
  /** Webhook successfully authenticated, deduplicated, and processed. (Integer: 1) */
  Processed: 'Processed',
  /** Duplicate webhook delivery detected and safely acknowledged. (Integer: 2) */
  Duplicate: 'Duplicate',
  /** Webhook signature or verification token failed authentication. (Integer: 3) */
  InvalidSignature: 'InvalidSignature',
  /** Webhook payload was malformed or missing required correlation identifiers. (Integer: 4) */
  InvalidPayload: 'InvalidPayload',
  /** Webhook was syntactically valid but safely ignored (e.g. unhandled event type). (Integer: 5) */
  Ignored: 'Ignored',
  /** Integer value: 6 */
  Error: 'Error',
});

/**
 * Numeric values for ComplianceWebhookProcessingStatus
 */
export const ComplianceWebhookProcessingStatusValues = Object.freeze({
  Processed: 1,
  Duplicate: 2,
  InvalidSignature: 3,
  InvalidPayload: 4,
  Ignored: 5,
  Error: 6,
});

/**
 * Supported currencies in CebizPay.  Transactional V1 currencies: NGN, INTERNATIONAL_NGN, USDT.  Reporting currencies: USD, GHS, EUR, INR.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const Currency = Object.freeze({
  /** Nigerian Naira. (Integer: 1) */
  NGN: 'NGN',
  /** International Nigerian Naira. (Integer: 2) */
  INTERNATIONAL_NGN: 'INTERNATIONAL_NGN',
  /** Tether USD Stablecoin. (Integer: 3) */
  USDT: 'USDT',
  /** US Dollar (Reporting/Display). (Integer: 4) */
  USD: 'USD',
  /** Ghanaian Cedi (Reporting/Display). (Integer: 5) */
  GHS: 'GHS',
  /** Euro (Reporting/Display). (Integer: 6) */
  EUR: 'EUR',
  /** Integer value: 7 */
  INR: 'INR',
});

/**
 * Numeric values for Currency
 */
export const CurrencyValues = Object.freeze({
  NGN: 1,
  INTERNATIONAL_NGN: 2,
  USDT: 3,
  USD: 4,
  GHS: 5,
  EUR: 6,
  INR: 7,
});

/**
 * Lifecycle status of an ERP customer.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const CustomerStatus = Object.freeze({
  /** Active customer. (Integer: 0) */
  Active: 'Active',
  /** Integer value: 1 */
  Inactive: 'Inactive',
});

/**
 * Numeric values for CustomerStatus
 */
export const CustomerStatusValues = Object.freeze({
  Active: 0,
  Inactive: 1,
});

/**
 * Client platform on which a mobile or web device runs.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const DevicePlatform = Object.freeze({
  /** Android mobile client. (Integer: 1) */
  Android: 'Android',
  /** iOS mobile client. (Integer: 2) */
  iOS: 'iOS',
  /** Integer value: 3 */
  Web: 'Web',
});

/**
 * Numeric values for DevicePlatform
 */
export const DevicePlatformValues = Object.freeze({
  Android: 1,
  iOS: 2,
  Web: 3,
});

/**
 * Supported KYC document types.
 * Namespace: CebizPay.Domain.Enums
 */
export const DocumentType = Object.freeze({
  /** NIMC slip or card. (Integer: 1) */
  Nimc: 'Nimc',
  /** Driver's license. (Integer: 2) */
  DriversLicense: 'DriversLicense',
  /** International passport. (Integer: 3) */
  InternationalPassport: 'InternationalPassport',
  /** Integer value: 4 */
  Liveness: 'Liveness',
});

/**
 * Numeric values for DocumentType
 */
export const DocumentTypeValues = Object.freeze({
  Nimc: 1,
  DriversLicense: 2,
  InternationalPassport: 3,
  Liveness: 4,
});

/**
 * Lifecycle status of an Enhanced Due Diligence (EDD) case.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const EddStatus = Object.freeze({
  /** EDD has been triggered by risk rules and is required. (Integer: 1) */
  Required: 'Required',
  /** EDD case has been opened and assigned for active investigation. (Integer: 2) */
  Initiated: 'Initiated',
  /** Additional documentation or information has been requested from the customer. (Integer: 3) */
  InformationRequested: 'InformationRequested',
  /** Customer has submitted the requested EDD documentation. (Integer: 4) */
  InformationSubmitted: 'InformationSubmitted',
  /** Submitted documentation is actively being evaluated by a compliance officer. (Integer: 5) */
  InReview: 'InReview',
  /** EDD case has been approved by authorized compliance officer / senior management. (Integer: 6) */
  Approved: 'Approved',
  /** EDD case has been rejected due to inadequate information or prohibitive risk. (Integer: 7) */
  Rejected: 'Rejected',
  /** Integer value: 8 */
  Escalated: 'Escalated',
});

/**
 * Numeric values for EddStatus
 */
export const EddStatusValues = Object.freeze({
  Required: 1,
  Initiated: 2,
  InformationRequested: 3,
  InformationSubmitted: 4,
  InReview: 5,
  Approved: 6,
  Rejected: 7,
  Escalated: 8,
});

/**
 * Status outcome of a transaction compliance eligibility evaluation.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const EligibilityStatus = Object.freeze({
  /** Transaction is fully allowed to proceed to financial processing. (Integer: 1) */
  Allowed: 'Allowed',
  /** Transaction is blocked due to active compliance restrictions or limits. (Integer: 2) */
  Restricted: 'Restricted',
  /** Transaction requires manual compliance officer review before execution. (Integer: 3) */
  ReviewRequired: 'ReviewRequired',
  /** Transaction is blocked pending completion of Enhanced Due Diligence (EDD). (Integer: 4) */
  EddRequired: 'EddRequired',
  /** Integer value: 5 */
  Suspended: 'Suspended',
});

/**
 * Numeric values for EligibilityStatus
 */
export const EligibilityStatusValues = Object.freeze({
  Allowed: 1,
  Restricted: 2,
  ReviewRequired: 3,
  EddRequired: 4,
  Suspended: 5,
});

/**
 * Represents the employment arrangement for a job posting.
 * Namespace: CebizPay.Domain.Enums
 */
export const EmploymentType = Object.freeze({
  /** Full-time employment. (Integer: 0) */
  FullTime: 'FullTime',
  /** Part-time employment. (Integer: 1) */
  PartTime: 'PartTime',
  /** Contract employment. (Integer: 2) */
  Contract: 'Contract',
  /** Internship. (Integer: 3) */
  Internship: 'Internship',
  /** Integer value: 4 */
  Remote: 'Remote',
});

/**
 * Numeric values for EmploymentType
 */
export const EmploymentTypeValues = Object.freeze({
  FullTime: 0,
  PartTime: 1,
  Contract: 2,
  Internship: 3,
  Remote: 4,
});

/**
 * Lifecycle status of an ERP service catalog item.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const ErpServiceStatus = Object.freeze({
  /** Active service. (Integer: 0) */
  Active: 'Active',
  /** Integer value: 1 */
  Inactive: 'Inactive',
});

/**
 * Numeric values for ErpServiceStatus
 */
export const ErpServiceStatusValues = Object.freeze({
  Active: 0,
  Inactive: 1,
});

/**
 * Execution attempt status for a payroll item financial operation.
 * Namespace: CebizPay.Domain.Payroll.Enums
 */
export const ExecutionAttemptStatus = Object.freeze({
  /** Attempt started by worker. (Integer: 1) */
  Started: 'Started',
  /** Attempt completed successfully. (Integer: 2) */
  Completed: 'Completed',
  /** Integer value: 3 */
  Failed: 'Failed',
});

/**
 * Numeric values for ExecutionAttemptStatus
 */
export const ExecutionAttemptStatusValues = Object.freeze({
  Started: 1,
  Completed: 2,
  Failed: 3,
});

/**
 * Operating expense categories.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const ExpenseCategory = Object.freeze({
  /** Rent and office lease. (Integer: 0) */
  Rent: 'Rent',
  /** Utilities (power, water, internet). (Integer: 1) */
  Utilities: 'Utilities',
  /** Non-payroll salaries and contract staff allowances. (Integer: 2) */
  Salaries: 'Salaries',
  /** Office and operational supplies. (Integer: 3) */
  Supplies: 'Supplies',
  /** Marketing, advertising and customer acquisition. (Integer: 4) */
  Marketing: 'Marketing',
  /** Travel, logistics, and accommodations. (Integer: 5) */
  Travel: 'Travel',
  /** Equipment repairs and office maintenance. (Integer: 6) */
  Maintenance: 'Maintenance',
  /** Legal, accounting and professional fees. (Integer: 7) */
  LegalAndProfessional: 'LegalAndProfessional',
  /** Insurance policies. (Integer: 8) */
  Insurance: 'Insurance',
  /** Integer value: 9 */
  Other: 'Other',
});

/**
 * Numeric values for ExpenseCategory
 */
export const ExpenseCategoryValues = Object.freeze({
  Rent: 0,
  Utilities: 1,
  Salaries: 2,
  Supplies: 3,
  Marketing: 4,
  Travel: 5,
  Maintenance: 6,
  LegalAndProfessional: 7,
  Insurance: 8,
  Other: 9,
});

/**
 * Method of payment for an operating expense.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const ExpensePaymentMethod = Object.freeze({
  /** Manual / external payment (cash, company cheque, outside bank transfer). (Integer: 0) */
  Manual: 'Manual',
  /** Integer value: 1 */
  Wallet: 'Wallet',
});

/**
 * Numeric values for ExpensePaymentMethod
 */
export const ExpensePaymentMethodValues = Object.freeze({
  Manual: 0,
  Wallet: 1,
});

/**
 * Lifecycle status of an operating expense.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const ExpenseStatus = Object.freeze({
  /** Draft expense. (Integer: 0) */
  Draft: 'Draft',
  /** Approved by authorized manager. (Integer: 1) */
  Approved: 'Approved',
  /** Paid and settled. (Integer: 2) */
  Paid: 'Paid',
  /** Integer value: 3 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for ExpenseStatus
 */
export const ExpenseStatusValues = Object.freeze({
  Draft: 0,
  Approved: 1,
  Paid: 2,
  Cancelled: 3,
});

/**
 * Lifecycle status for an external funding account attached to a wallet.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const ExternalFundingAccountStatus = Object.freeze({
  /** Account is active and eligible for receiving external funding or being primary. (Integer: 1) */
  Active: 'Active',
  /** Account is temporarily suspended. (Integer: 2) */
  Suspended: 'Suspended',
  /** Integer value: 3 */
  Closed: 'Closed',
});

/**
 * Numeric values for ExternalFundingAccountStatus
 */
export const ExternalFundingAccountStatusValues = Object.freeze({
  Active: 1,
  Suspended: 2,
  Closed: 3,
});

/**
 * Specifies the party responsible for platform fees and the settlement flow.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const FeeBearer = Object.freeze({
  /** Customer pays requested amount plus platform fee.      Beneficiary receives requested amount. (Integer: 1) */
  CustomerPays: 'CustomerPays',
  /** Fee is deducted directly from gross incoming funds.      Beneficiary receives net amount (gross - fee). (Integer: 2) */
  DeductFromFunds: 'DeductFromFunds',
  /** Integer value: 3 */
  PlatformAbsorbs: 'PlatformAbsorbs',
});

/**
 * Numeric values for FeeBearer
 */
export const FeeBearerValues = Object.freeze({
  CustomerPays: 1,
  DeductFromFunds: 2,
  PlatformAbsorbs: 3,
});

/**
 * Mathematical method used to calculate platform fees.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const FeeCalculationMethod = Object.freeze({
  /** No fee charged (fee = 0). (Integer: 1) */
  Free: 'Free',
  /** Fixed nominal fee charged regardless of transaction amount. (Integer: 2) */
  Fixed: 'Fixed',
  /** Proportional percentage fee without ceiling or floor. (Integer: 3) */
  Percentage: 'Percentage',
  /** Integer value: 4 */
  PercentageWithCap: 'PercentageWithCap',
});

/**
 * Numeric values for FeeCalculationMethod
 */
export const FeeCalculationMethodValues = Object.freeze({
  Free: 1,
  Fixed: 2,
  Percentage: 3,
  PercentageWithCap: 4,
});

/**
 * Financial operation type governed by platform fee policies.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const FeeOperationType = Object.freeze({
  /** Inbound dedicated/dynamic virtual account funding. (Integer: 1) */
  VirtualAccountFunding: 'VirtualAccountFunding',
  /** Inbound card checkout funding. (Integer: 2) */
  CardFunding: 'CardFunding',
  /** Outbound bank transfer / payout. (Integer: 3) */
  BankTransfer: 'BankTransfer',
  /** Integer value: 4 */
  PeerTransfer: 'PeerTransfer',
});

/**
 * Numeric values for FeeOperationType
 */
export const FeeOperationTypeValues = Object.freeze({
  VirtualAccountFunding: 1,
  CardFunding: 2,
  BankTransfer: 3,
  PeerTransfer: 4,
});

/**
 * Peer transfer fee policy mode.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const FeePolicyMode = Object.freeze({
  /** No fee is charged on peer transfers. (Integer: 1) */
  Free: 'Free',
  /** Integer value: 2 */
  Percentage: 'Percentage',
});

/**
 * Numeric values for FeePolicyMode
 */
export const FeePolicyModeValues = Object.freeze({
  Free: 1,
  Percentage: 2,
});

/**
 * Channel used for wallet funding.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const FundingChannel = Object.freeze({
  /** Inbound bank transfer to a dedicated/dynamic virtual account. (Integer: 1) */
  VirtualAccount: 'VirtualAccount',
  /** Integer value: 2 */
  Card: 'Card',
});

/**
 * Numeric values for FundingChannel
 */
export const FundingChannelValues = Object.freeze({
  VirtualAccount: 1,
  Card: 2,
});

/**
 * Status of a wallet funding transaction.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const FundingTransactionStatus = Object.freeze({
  /** Funding initiated / payment pending provider confirmation. (Integer: 1) */
  Pending: 'Pending',
  /** Funding confirmed and credited through the central ledger. (Integer: 2) */
  Completed: 'Completed',
  /** Funding failed or rejected by provider. (Integer: 3) */
  Failed: 'Failed',
  /** Funding is currently processing / locking resources. (Integer: 4) */
  Processing: 'Processing',
  /** Funding outcome is unknown / pending provider reconciliation. (Integer: 5) */
  Unknown: 'Unknown',
  /** Integer value: 6 */
  Reversed: 'Reversed',
});

/**
 * Numeric values for FundingTransactionStatus
 */
export const FundingTransactionStatusValues = Object.freeze({
  Pending: 1,
  Completed: 2,
  Failed: 3,
  Processing: 4,
  Unknown: 5,
  Reversed: 6,
});

/**
 * Super Admin policy mode governing interest calculations on goal-based savings.
 * Namespace: CebizPay.Domain.Savings.Enums
 */
export const GoalInterestPolicyMode = Object.freeze({
  /** No interest accrual (0% annual interest rate). (Integer: 1) */
  None: 'None',
  /** Integer value: 2 */
  Percentage: 'Percentage',
});

/**
 * Numeric values for GoalInterestPolicyMode
 */
export const GoalInterestPolicyModeValues = Object.freeze({
  None: 1,
  Percentage: 2,
});

/**
 * Status of an idempotency request record.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const IdempotencyStatus = Object.freeze({
  /** Request is currently being processed. (Integer: 1) */
  Processing: 'Processing',
  /** Request completed successfully. (Integer: 2) */
  Completed: 'Completed',
  /** Integer value: 3 */
  Failed: 'Failed',
});

/**
 * Numeric values for IdempotencyStatus
 */
export const IdempotencyStatusValues = Object.freeze({
  Processing: 1,
  Completed: 2,
  Failed: 3,
});

/**
 * Status of an inventory item.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const InventoryItemStatus = Object.freeze({
  /** Active and available for stock transactions. (Integer: 0) */
  Active: 'Active',
  /** Inactive and disabled for regular stock operations. (Integer: 1) */
  Inactive: 'Inactive',
  /** Integer value: 2 */
  Discontinued: 'Discontinued',
});

/**
 * Numeric values for InventoryItemStatus
 */
export const InventoryItemStatusValues = Object.freeze({
  Active: 0,
  Inactive: 1,
  Discontinued: 2,
});

/**
 * Status of a staff invitation.
 * Namespace: CebizPay.Domain.Enums
 */
export const InvitationStatus = Object.freeze({
  /** Pending invitation. (Integer: 1) */
  Pending: 'Pending',
  /** Accepted invitation. (Integer: 2) */
  Accepted: 'Accepted',
  /** Rejected invitation. (Integer: 3) */
  Rejected: 'Rejected',
  /** Integer value: 4 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for InvitationStatus
 */
export const InvitationStatusValues = Object.freeze({
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
  Cancelled: 4,
});

/**
 * Method of settlement for an ERP invoice.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const InvoiceSettlementMethod = Object.freeze({
  /** Manual / external payment (cash, bank deposit, POS, cheque). (Integer: 0) */
  Manual: 'Manual',
  /** Integer value: 1 */
  Wallet: 'Wallet',
});

/**
 * Numeric values for InvoiceSettlementMethod
 */
export const InvoiceSettlementMethodValues = Object.freeze({
  Manual: 0,
  Wallet: 1,
});

/**
 * Status of an ERP invoice.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const InvoiceStatus = Object.freeze({
  /** Draft invoice. (Integer: 0) */
  Draft: 'Draft',
  /** Issued to customer and pending payment. (Integer: 1) */
  Issued: 'Issued',
  /** Partially paid. (Integer: 2) */
  PartiallyPaid: 'PartiallyPaid',
  /** Fully paid and closed. (Integer: 3) */
  Paid: 'Paid',
  /** Past due date. (Integer: 4) */
  Overdue: 'Overdue',
  /** Integer value: 5 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for InvoiceStatus
 */
export const InvoiceStatusValues = Object.freeze({
  Draft: 0,
  Issued: 1,
  PartiallyPaid: 2,
  Paid: 3,
  Overdue: 4,
  Cancelled: 5,
});

/**
 * Represents the lifecycle status of an organization job posting.
 * Namespace: CebizPay.Domain.Enums
 */
export const JobPostingStatus = Object.freeze({
  /** Draft job posting undergoing editing and not yet visible. (Integer: 0) */
  Draft: 'Draft',
  /** Published job posting actively accepting applications. (Integer: 1) */
  Published: 'Published',
  /** Closed job posting no longer accepting new applications. (Integer: 2) */
  Closed: 'Closed',
  /** Integer value: 3 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for JobPostingStatus
 */
export const JobPostingStatusValues = Object.freeze({
  Draft: 0,
  Published: 1,
  Closed: 2,
  Cancelled: 3,
});

/**
 * States for the deterministic Kola chatbot interaction state machine.
 * Namespace: CebizPay.Domain.Support.Enums
 */
export const KolaSessionState = Object.freeze({
  /** Session started; presenting 6 root triage categories. (Integer: 1) */
  Started: 'Started',
  /** Root category selected; presenting numbered sub-issues. (Integer: 2) */
  CategorySelected: 'CategorySelected',
  /** Specific sub-issue selected; evaluating guidance or requesting additional context. (Integer: 3) */
  IssueSelected: 'IssueSelected',
  /** Specific reference or information requested from the user. (Integer: 4) */
  InformationRequested: 'InformationRequested',
  /** Self-service resolution steps suggested to the user. (Integer: 5) */
  ResolutionSuggested: 'ResolutionSuggested',
  /** Session escalated due to keyword match, user request, or critical financial classification. (Integer: 6) */
  Escalated: 'Escalated',
  /** User confirmed resolution of inquiry without ticket creation. (Integer: 7) */
  Resolved: 'Resolved',
  /** Integer value: 8 */
  TicketCreated: 'TicketCreated',
});

/**
 * Numeric values for KolaSessionState
 */
export const KolaSessionStateValues = Object.freeze({
  Started: 1,
  CategorySelected: 2,
  IssueSelected: 3,
  InformationRequested: 4,
  ResolutionSuggested: 5,
  Escalated: 6,
  Resolved: 7,
  TicketCreated: 8,
});

/**
 * Represents the KYB status of an organization.
 * Namespace: CebizPay.Domain.Enums
 */
export const KybStatus = Object.freeze({
  /** Pending registration. (Integer: 1) */
  Pending: 'Pending',
  /** Step 1 completed. (Integer: 2) */
  Step1Completed: 'Step1Completed',
  /** Step 2 completed. (Integer: 3) */
  Step2Completed: 'Step2Completed',
  /** Verified KYB status. (Integer: 4) */
  Verified: 'Verified',
  /** Rejected KYB status. (Integer: 5) */
  Rejected: 'Rejected',
  /** Integer value: 6 */
  Suspended: 'Suspended',
});

/**
 * Numeric values for KybStatus
 */
export const KybStatusValues = Object.freeze({
  Pending: 1,
  Step1Completed: 2,
  Step2Completed: 3,
  Verified: 4,
  Rejected: 5,
  Suspended: 6,
});

/**
 * Represents the KYC status of an individual user.
 * Namespace: CebizPay.Domain.Enums
 */
export const KycStatus = Object.freeze({
  /** Pending verification. (Integer: 1) */
  Pending: 'Pending',
  /** Verified KYC status. (Integer: 2) */
  Verified: 'Verified',
  /** Integer value: 3 */
  Rejected: 'Rejected',
});

/**
 * Numeric values for KycStatus
 */
export const KycStatusValues = Object.freeze({
  Pending: 1,
  Verified: 2,
  Rejected: 3,
});

/**
 * Lifecycle status of a ledger account.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const LedgerAccountStatus = Object.freeze({
  /** Active ledger account. (Integer: 1) */
  Active: 'Active',
  /** Frozen ledger account. (Integer: 2) */
  Frozen: 'Frozen',
  /** Integer value: 3 */
  Closed: 'Closed',
});

/**
 * Numeric values for LedgerAccountStatus
 */
export const LedgerAccountStatusValues = Object.freeze({
  Active: 1,
  Frozen: 2,
  Closed: 3,
});

/**
 * Type of ledger account.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const LedgerAccountType = Object.freeze({
  /** Customer user/organization wallet account. (Integer: 1) */
  CustomerWallet: 'CustomerWallet',
  /** Platform FX settlement / clearing account. (Integer: 2) */
  SystemSettlement: 'SystemSettlement',
  /** Platform fee revenue account. (Integer: 3) */
  FeeRevenue: 'FeeRevenue',
  /** Integer value: 4 */
  PlatformClearing: 'PlatformClearing',
});

/**
 * Numeric values for LedgerAccountType
 */
export const LedgerAccountTypeValues = Object.freeze({
  CustomerWallet: 1,
  SystemSettlement: 2,
  FeeRevenue: 3,
  PlatformClearing: 4,
});

/**
 * Direction of a double-entry ledger record.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const LedgerEntryDirection = Object.freeze({
  /** Debit entry (money out for asset/expense accounts, money in for liabilities/equity). (Integer: 1) */
  Debit: 'Debit',
  /** Integer value: 2 */
  Credit: 'Credit',
});

/**
 * Numeric values for LedgerEntryDirection
 */
export const LedgerEntryDirectionValues = Object.freeze({
  Debit: 1,
  Credit: 2,
});

/**
 * Status lifecycle of a ledger transaction.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const LedgerTransactionStatus = Object.freeze({
  /** Pending transaction. (Integer: 1) */
  Pending: 'Pending',
  /** Processing transaction. (Integer: 2) */
  Processing: 'Processing',
  /** Completed transaction. (Integer: 3) */
  Completed: 'Completed',
  /** Failed transaction. (Integer: 4) */
  Failed: 'Failed',
  /** Integer value: 5 */
  Reversed: 'Reversed',
});

/**
 * Numeric values for LedgerTransactionStatus
 */
export const LedgerTransactionStatusValues = Object.freeze({
  Pending: 1,
  Processing: 2,
  Completed: 3,
  Failed: 4,
  Reversed: 5,
});

/**
 * Categorization of ledger transactions.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const LedgerTransactionType = Object.freeze({
  /** Peer to peer transfer. (Integer: 1) */
  PeerTransfer: 'PeerTransfer',
  /** Bank transfer. (Integer: 2) */
  BankTransfer: 'BankTransfer',
  /** Corporate payroll disbursement. (Integer: 3) */
  Payroll: 'Payroll',
  /** Loan disbursement. (Integer: 4) */
  LoanDisbursement: 'LoanDisbursement',
  /** Loan repayment. (Integer: 5) */
  LoanRepayment: 'LoanRepayment',
  /** Savings contribution. (Integer: 6) */
  SavingsContribution: 'SavingsContribution',
  /** Savings withdrawal. (Integer: 7) */
  SavingsWithdrawal: 'SavingsWithdrawal',
  /** Thrift contribution. (Integer: 8) */
  ThriftContribution: 'ThriftContribution',
  /** Thrift payout. (Integer: 9) */
  ThriftPayout: 'ThriftPayout',
  /** Value added service purchase. (Integer: 10) */
  VasPurchase: 'VasPurchase',
  /** Platform fee entry. (Integer: 11) */
  Fee: 'Fee',
  /** Refund. (Integer: 12) */
  Refund: 'Refund',
  /** Reversal of a prior transaction. (Integer: 13) */
  Reversal: 'Reversal',
  /** Cross-currency FX conversion. (Integer: 14) */
  FxConversion: 'FxConversion',
  /** Inbound bank deposit to virtual account. (Integer: 15) */
  VirtualAccountDeposit: 'VirtualAccountDeposit',
  /** Inbound card payment / checkout charge. (Integer: 16) */
  CardFunding: 'CardFunding',
  /** ERP operating expense payment from wallet. (Integer: 17) */
  ErpExpense: 'ErpExpense',
  /** ERP invoice payment settled via wallet. (Integer: 18) */
  ErpInvoicePayment: 'ErpInvoicePayment',
  /** Integer value: 19 */
  CompanyVoucherDisbursement: 'CompanyVoucherDisbursement',
});

/**
 * Numeric values for LedgerTransactionType
 */
export const LedgerTransactionTypeValues = Object.freeze({
  PeerTransfer: 1,
  BankTransfer: 2,
  Payroll: 3,
  LoanDisbursement: 4,
  LoanRepayment: 5,
  SavingsContribution: 6,
  SavingsWithdrawal: 7,
  ThriftContribution: 8,
  ThriftPayout: 9,
  VasPurchase: 10,
  Fee: 11,
  Refund: 12,
  Reversal: 13,
  FxConversion: 14,
  VirtualAccountDeposit: 15,
  CardFunding: 16,
  ErpExpense: 17,
  ErpInvoicePayment: 18,
  CompanyVoucherDisbursement: 19,
});

/**
 * Identifies which regulatory, product, provider, or account risk layer dictates a transaction limit.
 * Namespace: CebizPay.Application.Common.Interfaces.Compliance
 */
export const LimitConstraintSource = Object.freeze({
  /** Non-overridable statutory ceiling established by Central Bank of Nigeria (CBN) regulations. (Integer: 0) */
  RegulatoryCbnTierLimit: 'RegulatoryCbnTierLimit',
  /** Configurable business policy established by CebizPay product management within regulatory bounds. (Integer: 1) */
  CebizPayProductPolicy: 'CebizPayProductPolicy',
  /** External rail constraint imposed by upstream payment infrastructure provider (e.g. Monnify, Flutterwave). (Integer: 2) */
  PaymentProviderRailConstraint: 'PaymentProviderRailConstraint',
  /** Integer value: 3 */
  CustomerRiskRestriction: 'CustomerRiskRestriction',
});

/**
 * Numeric values for LimitConstraintSource
 */
export const LimitConstraintSourceValues = Object.freeze({
  RegulatoryCbnTierLimit: 0,
  CebizPayProductPolicy: 1,
  PaymentProviderRailConstraint: 2,
  CustomerRiskRestriction: 3,
});

/**
 * Lifecycle status of a corporate staff loan application.
 * Namespace: CebizPay.Domain.Loans.Enums
 */
export const LoanApplicationStatus = Object.freeze({
  /** Draft application not yet submitted for review. (Integer: 1) */
  Draft: 'Draft',
  /** Application submitted by staff member and awaiting review/decision. (Integer: 2) */
  Submitted: 'Submitted',
  /** Application routed for manual HR / underwriting review (e.g. salary verification). (Integer: 3) */
  UnderReview: 'UnderReview',
  /** Application approved by authorized organization executive. (Integer: 4) */
  Approved: 'Approved',
  /** Application formally declined. (Integer: 5) */
  Declined: 'Declined',
  /** Integer value: 6 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for LoanApplicationStatus
 */
export const LoanApplicationStatusValues = Object.freeze({
  Draft: 1,
  Submitted: 2,
  UnderReview: 3,
  Approved: 4,
  Declined: 5,
  Cancelled: 6,
});

/**
 * Status of an active or concluded loan obligation contract.
 * Namespace: CebizPay.Domain.Loans.Enums
 */
export const LoanContractStatus = Object.freeze({
  /** Active loan contract with outstanding repayment installments. (Integer: 1) */
  Active: 'Active',
  /** All principal and interest fully settled and paid off. (Integer: 2) */
  PaidOff: 'PaidOff',
  /** One or more installments past due date without settlement. (Integer: 3) */
  Overdue: 'Overdue',
  /** Contract defaulted following policy determination. (Integer: 4) */
  Defaulted: 'Defaulted',
  /** Corporate payroll loan converted to a standard individual loan following staff termination. (Integer: 5) */
  ConvertedToIndividual: 'ConvertedToIndividual',
  /** Integer value: 6 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for LoanContractStatus
 */
export const LoanContractStatusValues = Object.freeze({
  Active: 1,
  PaidOff: 2,
  Overdue: 3,
  Defaulted: 4,
  ConvertedToIndividual: 5,
  Cancelled: 6,
});

/**
 * Status of an individual scheduled repayment installment.
 * Namespace: CebizPay.Domain.Loans.Enums
 */
export const LoanRepaymentStatus = Object.freeze({
  /** Scheduled installment awaiting future due date. (Integer: 1) */
  Pending: 'Pending',
  /** Installment currently due for payroll auto-deduction or payment. (Integer: 2) */
  Due: 'Due',
  /** Installment fully paid and settled. (Integer: 3) */
  Paid: 'Paid',
  /** Installment due date passed without full payment. (Integer: 4) */
  Missed: 'Missed',
  /** Integer value: 5 */
  Waived: 'Waived',
});

/**
 * Numeric values for LoanRepaymentStatus
 */
export const LoanRepaymentStatusValues = Object.freeze({
  Pending: 1,
  Due: 2,
  Paid: 3,
  Missed: 4,
  Waived: 5,
});

/**
 * Classification of loan obligation.
 * Namespace: CebizPay.Domain.Loans.Enums
 */
export const LoanType = Object.freeze({
  /** Corporate payroll loan repaid automatically via employer salary deductions. (Integer: 1) */
  CorporatePayrollLoan: 'CorporatePayrollLoan',
  /** Integer value: 2 */
  StandardIndividualLoan: 'StandardIndividualLoan',
});

/**
 * Numeric values for LoanType
 */
export const LoanTypeValues = Object.freeze({
  CorporatePayrollLoan: 1,
  StandardIndividualLoan: 2,
});

/**
 * Operational decisions permitted during administrative manual review of ambiguous reconciliation records.
 * Namespace: CebizPay.Application.Common.Interfaces.Payments
 */
export const ManualReviewDecision = Object.freeze({
  /** Confirms verified external execution and settles internal state. (Integer: 1) */
  ConfirmSuccess: 'ConfirmSuccess',
  /** Confirms verified external failure/non-execution and safely unlocks or fails internal state. (Integer: 2) */
  ConfirmFailure: 'ConfirmFailure',
  /** Confirms external reversal/refund and records recovery if required. (Integer: 3) */
  ConfirmReversal: 'ConfirmReversal',
  /** Integer value: 4 */
  Dismiss: 'Dismiss',
});

/**
 * Numeric values for ManualReviewDecision
 */
export const ManualReviewDecisionValues = Object.freeze({
  ConfirmSuccess: 1,
  ConfirmFailure: 2,
  ConfirmReversal: 3,
  Dismiss: 4,
});

/**
 * Role of a user within an organization membership.
 * Namespace: CebizPay.Domain.Enums
 */
export const MembershipRoleType = Object.freeze({
  /** Organization owner / CEO (ORG_SUPER_ADMIN). (Integer: 1) */
  Owner: 'Owner',
  /** Organization admin role. (Integer: 2) */
  Admin: 'Admin',
  /** Standard organization member role. (Integer: 3) */
  Member: 'Member',
  /** Finance / Payroll manager role (FINANCE_MANAGER). (Integer: 4) */
  PayrollManager: 'PayrollManager',
  /** Integer value: 5 */
  HrManager: 'HrManager',
});

/**
 * Numeric values for MembershipRoleType
 */
export const MembershipRoleTypeValues = Object.freeze({
  Owner: 1,
  Admin: 2,
  Member: 3,
  PayrollManager: 4,
  HrManager: 5,
});

/**
 * Represents the status of a user's membership within an organization.
 * Namespace: CebizPay.Domain.Enums
 */
export const MembershipStatus = Object.freeze({
  /** Active workplace member. (Integer: 1) */
  Active: 'Active',
  /** Suspended workplace member. (Integer: 2) */
  Suspended: 'Suspended',
  /** Integer value: 3 */
  Terminated: 'Terminated',
});

/**
 * Numeric values for MembershipStatus
 */
export const MembershipStatusValues = Object.freeze({
  Active: 1,
  Suspended: 2,
  Terminated: 3,
});

/**
 * Normalized outcome category of an external provider webhook notification.
 * Namespace: CebizPay.Application.Common.Interfaces.Payments
 */
export const NormalizedWebhookOutcome = Object.freeze({
  /** Definitive success reported by provider. (Integer: 0) */
  Success: 'Success',
  /** Definitive failure or rejection reported by provider. (Integer: 1) */
  Failure: 'Failure',
  /** Transaction currently in progress or awaiting clearing. (Integer: 2) */
  Pending: 'Pending',
  /** Transaction reversed or refunded by provider. (Integer: 3) */
  Reversed: 'Reversed',
  /** Integer value: 4 */
  Unknown: 'Unknown',
});

/**
 * Numeric values for NormalizedWebhookOutcome
 */
export const NormalizedWebhookOutcomeValues = Object.freeze({
  Success: 0,
  Failure: 1,
  Pending: 2,
  Reversed: 3,
  Unknown: 4,
});

/**
 * Delivery channels supported by the notification platform.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const NotificationChannel = Object.freeze({
  /** In-app notification persisted to the user's notification center. (Integer: 1) */
  InApp: 'InApp',
  /** Push notification dispatched via Firebase Cloud Messaging (FCM). (Integer: 2) */
  Push: 'Push',
  /** Transactional email dispatched via email infrastructure. (Integer: 3) */
  Email: 'Email',
  /** Integer value: 4 */
  Sms: 'Sms',
});

/**
 * Numeric values for NotificationChannel
 */
export const NotificationChannelValues = Object.freeze({
  InApp: 1,
  Push: 2,
  Email: 3,
  Sms: 4,
});

/**
 * Status representing the delivery outcome of a notification dispatch attempt across a channel.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const NotificationDeliveryStatus = Object.freeze({
  /** Pending dispatch to channel. (Integer: 1) */
  Pending: 'Pending',
  /** Successfully delivered or accepted by the provider. (Integer: 2) */
  Delivered: 'Delivered',
  /** Failed due to technical or business provider error. (Integer: 3) */
  Failed: 'Failed',
  /** Throttled due to per-user rate limit protection. (Integer: 4) */
  Throttled: 'Throttled',
  /** Suppressed because the user opted out via notification preferences. (Integer: 5) */
  SuppressedByPreference: 'SuppressedByPreference',
  /** Integer value: 6 */
  Duplicate: 'Duplicate',
});

/**
 * Numeric values for NotificationDeliveryStatus
 */
export const NotificationDeliveryStatusValues = Object.freeze({
  Pending: 1,
  Delivered: 2,
  Failed: 3,
  Throttled: 4,
  SuppressedByPreference: 5,
  Duplicate: 6,
});

/**
 * Priority level determining dispatch channels and delivery urgency.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const NotificationPriority = Object.freeze({
  /** Low priority notifications (e.g. general updates, marketing). (Integer: 1) */
  Low: 'Low',
  /** Normal operational notifications (e.g. peer transfers, announcements). (Integer: 2) */
  Normal: 'Normal',
  /** High priority transactional notifications (e.g. loan approvals, payroll payouts). (Integer: 3) */
  High: 'High',
  /** Integer value: 4 */
  Critical: 'Critical',
});

/**
 * Numeric values for NotificationPriority
 */
export const NotificationPriorityValues = Object.freeze({
  Low: 1,
  Normal: 2,
  High: 3,
  Critical: 4,
});

/**
 * Domain enumeration representing supported notification categories across CebizPay bounded contexts.
 * Namespace: CebizPay.Domain.Communication.Enums
 */
export const NotificationType = Object.freeze({
  /** Emitted when an organization is suspended or compliance-restricted. (Integer: 1) */
  OrganizationSuspended: 'OrganizationSuspended',
  /** Emitted when a corporate or staff loan application is approved. (Integer: 2) */
  LoanApproved: 'LoanApproved',
  /** Emitted when a payroll batch disbursement completes successfully. (Integer: 3) */
  PayrollCompleted: 'PayrollCompleted',
  /** Emitted when a thrift contribution is missed or a member cycle becomes delinquent. (Integer: 4) */
  ThriftDelinquency: 'ThriftDelinquency',
  /** Emitted when a global platform announcement is officially published. (Integer: 5) */
  PlatformAnnouncement: 'PlatformAnnouncement',
  /** Emitted when a tenant-scoped workplace announcement is officially published. (Integer: 6) */
  WorkplaceAnnouncement: 'WorkplaceAnnouncement',
  /** Integer value: 7 */
  SecurityAlert: 'SecurityAlert',
});

/**
 * Numeric values for NotificationType
 */
export const NotificationTypeValues = Object.freeze({
  OrganizationSuspended: 1,
  LoanApproved: 2,
  PayrollCompleted: 3,
  ThriftDelinquency: 4,
  PlatformAnnouncement: 5,
  WorkplaceAnnouncement: 6,
  SecurityAlert: 7,
});

/**
 * Represents the lifecycle status of an organization.
 * Namespace: CebizPay.Domain.Enums
 */
export const OrganizationStatus = Object.freeze({
  /** Pending verification. (Integer: 1) */
  Pending: 'Pending',
  /** Verified status. (Integer: 2) */
  Verified: 'Verified',
  /** Rejected status. (Integer: 3) */
  Rejected: 'Rejected',
  /** Integer value: 4 */
  Suspended: 'Suspended',
});

/**
 * Numeric values for OrganizationStatus
 */
export const OrganizationStatusValues = Object.freeze({
  Pending: 1,
  Verified: 2,
  Rejected: 3,
  Suspended: 4,
});

/**
 * Lifecycle status of an individual external payment provider attempt.   State transitions:  Created -> Processing  Created -> Cancelled  Processing -> Succeeded  Processing -> Failed  Processing -> Unknown  Unknown -> Succeeded  Unknown -> Failed  Unknown -> Cancelled
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const PaymentAttemptStatus = Object.freeze({
  /** Attempt created and initialized internally, not yet dispatched to provider. (Integer: 1) */
  Created: 'Created',
  /** Attempt dispatched and actively in-flight with external provider. (Integer: 2) */
  Processing: 'Processing',
  /** Attempt confirmed successful by provider. Terminal state. (Integer: 3) */
  Succeeded: 'Succeeded',
  /** Attempt definitively failed / rejected by provider. Terminal state. (Integer: 4) */
  Failed: 'Failed',
  /** Attempt outcome indeterminate (e.g. timeout / network partition). Requires reconciliation. (Integer: 5) */
  Unknown: 'Unknown',
  /** Integer value: 6 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for PaymentAttemptStatus
 */
export const PaymentAttemptStatusValues = Object.freeze({
  Created: 1,
  Processing: 2,
  Succeeded: 3,
  Failed: 4,
  Unknown: 5,
  Cancelled: 6,
});

/**
 * Distinct external payment and banking capability rails.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const PaymentCapability = Object.freeze({
  /** Dedicated or dynamic virtual account issuance and management. (Integer: 1) */
  VirtualAccount: 'VirtualAccount',
  /** Hosted / tokenized card payment processing and collection. (Integer: 2) */
  CardFunding: 'CardFunding',
  /** Outbound bank transfers / payouts to external financial institutions. (Integer: 3) */
  BankTransfer: 'BankTransfer',
  /** Integer value: 4 */
  BankAccountResolution: 'BankAccountResolution',
});

/**
 * Numeric values for PaymentCapability
 */
export const PaymentCapabilityValues = Object.freeze({
  VirtualAccount: 1,
  CardFunding: 2,
  BankTransfer: 3,
  BankAccountResolution: 4,
});

/**
 * Supported external payment service providers in CebizPay.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const PaymentProvider = Object.freeze({
  /** Flutterwave payment gateway. (Integer: 1) */
  Flutterwave: 'Flutterwave',
  /** Paystack payment gateway. (Integer: 2) */
  Paystack: 'Paystack',
  /** Integer value: 3 */
  Monnify: 'Monnify',
});

/**
 * Numeric values for PaymentProvider
 */
export const PaymentProviderValues = Object.freeze({
  Flutterwave: 1,
  Paystack: 2,
  Monnify: 3,
});

/**
 * Classification of a payment provider response outcome.  Essential for gateway failover decision-making.
 * Namespace: CebizPay.Application.Common.Interfaces.Payments
 */
export const PaymentProviderResultStatus = Object.freeze({
  /** Operation confirmed successful by the provider. Never retry or fail over. (Integer: 1) */
  Success: 'Success',
  /** Operation rejected due to business rules (e.g. invalid account, insufficient provider balance). Do not automatically switch provider. (Integer: 2) */
  BusinessFailure: 'BusinessFailure',
  /** Operation failed due to technical / infrastructure error (e.g. 503 Service Unavailable, network timeout on connect). Fallback / retry may be allowed. (Integer: 3) */
  TechnicalFailure: 'TechnicalFailure',
  /** Integer value: 4 */
  Unknown: 'Unknown',
});

/**
 * Numeric values for PaymentProviderResultStatus
 */
export const PaymentProviderResultStatusValues = Object.freeze({
  Success: 1,
  BusinessFailure: 2,
  TechnicalFailure: 3,
  Unknown: 4,
});

/**
 * Lifecycle state of a payroll batch orchestration container.
 * Namespace: CebizPay.Domain.Payroll.Enums
 */
export const PayrollBatchStatus = Object.freeze({
  /** Batch created; waiting for background worker claiming. (Integer: 1) */
  Pending: 'Pending',
  /** Worker is actively processing items. (Integer: 2) */
  Processing: 'Processing',
  /** All eligible items completed successfully. (Integer: 3) */
  Completed: 'Completed',
  /** Some items completed; one or more items failed/unresolved. (Integer: 4) */
  PartiallyCompleted: 'PartiallyCompleted',
  /** Zero items succeeded; entire batch encountered terminal failure. (Integer: 5) */
  Failed: 'Failed',
  /** Integer value: 6 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for PayrollBatchStatus
 */
export const PayrollBatchStatusValues = Object.freeze({
  Pending: 1,
  Processing: 2,
  Completed: 3,
  PartiallyCompleted: 4,
  Failed: 5,
  Cancelled: 6,
});

/**
 * Lifecycle state of an individual payroll item financial unit.
 * Namespace: CebizPay.Domain.Payroll.Enums
 */
export const PayrollItemStatus = Object.freeze({
  /** Pending worker pickup. (Integer: 1) */
  Pending: 'Pending',
  /** Currently claimed and processing by a worker. (Integer: 2) */
  Processing: 'Processing',
  /** Financially settled and voucher generated (Terminal state). (Integer: 3) */
  Completed: 'Completed',
  /** Financial execution failed (Eligible for retry). (Integer: 4) */
  Failed: 'Failed',
  /** Integer value: 5 */
  RetryPending: 'RetryPending',
});

/**
 * Numeric values for PayrollItemStatus
 */
export const PayrollItemStatusValues = Object.freeze({
  Pending: 1,
  Processing: 2,
  Completed: 3,
  Failed: 4,
  RetryPending: 5,
});

/**
 * Workforce selection modes for payroll execution.
 * Namespace: CebizPay.Domain.Payroll.Enums
 */
export const PayrollSelectionMode = Object.freeze({
  /** All eligible active employees in the organization. (Integer: 1) */
  All: 'All',
  /** Filtered by department IDs. (Integer: 2) */
  Department: 'Department',
  /** Filtered by workforce role IDs. (Integer: 3) */
  Role: 'Role',
  /** Filtered by salary level IDs. (Integer: 4) */
  Level: 'Level',
  /** Integer value: 5 */
  Individual: 'Individual',
});

/**
 * Numeric values for PayrollSelectionMode
 */
export const PayrollSelectionModeValues = Object.freeze({
  All: 1,
  Department: 2,
  Role: 3,
  Level: 4,
  Individual: 5,
});

/**
 * Represents the work professional status of an individual.  Derived from active organization relationships.
 * Namespace: CebizPay.Domain.Enums
 */
export const ProfessionalStatus = Object.freeze({
  /** Not currently affiliated with any active organization. (Integer: 1) */
  NotAStaff: 'NotAStaff',
  /** Integer value: 2 */
  Staff: 'Staff',
});

/**
 * Numeric values for ProfessionalStatus
 */
export const ProfessionalStatusValues = Object.freeze({
  NotAStaff: 1,
  Staff: 2,
});

/**
 * Status of a purchase order.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const PurchaseOrderStatus = Object.freeze({
  /** Draft purchase order. (Integer: 0) */
  Draft: 'Draft',
  /** Confirmed and awaiting vendor shipment/delivery. (Integer: 1) */
  Confirmed: 'Confirmed',
  /** Partially received into inventory. (Integer: 2) */
  PartiallyReceived: 'PartiallyReceived',
  /** Fully received into inventory. (Integer: 3) */
  Received: 'Received',
  /** Integer value: 4 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for PurchaseOrderStatus
 */
export const PurchaseOrderStatusValues = Object.freeze({
  Draft: 0,
  Confirmed: 1,
  PartiallyReceived: 2,
  Received: 3,
  Cancelled: 4,
});

/**
 * Confirms verified external execution and settles internal state.</summary>     ConfirmSuccess = 1,       <summary>Confirms verified external failure/non-execution and safely unlocks or fails internal state.</summary>     ConfirmFailure = 2,       <summary>Confirms external reversal/refund and records recovery if required.</summary>     ConfirmReversal = 3,       <summary>Dismisses anomaly as non-actionable or already resolved.</summary>     Dismiss = 4 }   <summary>  High-level outcome category of a reconciliation operation.
 * Namespace: CebizPay.Application.Common.Interfaces.Payments
 */
export const ReconciliationOutcome = Object.freeze({
  /** Integer value: 0 */
  Success: 'Success',
  /** Integer value: 1 */
  Failure: 'Failure',
  /** Integer value: 2 */
  Reversed: 'Reversed',
  /** Integer value: 3 */
  Unresolved: 'Unresolved',
  /** Integer value: 4 */
  ManualReviewRequired: 'ManualReviewRequired',
  /** Integer value: 5 */
  Error: 'Error',
});

/**
 * Numeric values for ReconciliationOutcome
 */
export const ReconciliationOutcomeValues = Object.freeze({
  Success: 0,
  Failure: 1,
  Reversed: 2,
  Unresolved: 3,
  ManualReviewRequired: 4,
  Error: 5,
});

/**
 * Lifecycle state of a reconciliation workflow between internal operations and external provider rails.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const ReconciliationStatus = Object.freeze({
  /** Reconciliation not required (operation finalized synchronously or via standard webhook). (Integer: 0) */
  NotRequired: 'NotRequired',
  /** Reconciliation scheduled or awaiting next provider query. (Integer: 1) */
  Pending: 'Pending',
  /** Reconciliation actively in progress / claimed by worker. (Integer: 2) */
  InProgress: 'InProgress',
  /** Definitively resolved as successful external execution and settled internally. (Integer: 3) */
  ResolvedSuccess: 'ResolvedSuccess',
  /** Definitively resolved as failed external execution; internal state marked failed safely. (Integer: 4) */
  ResolvedFailure: 'ResolvedFailure',
  /** Resolved through refund or reversal settlement. (Integer: 5) */
  ResolvedReversed: 'ResolvedReversed',
  /** External outcome remains ambiguous after bounded retry attempts. (Integer: 6) */
  Unresolved: 'Unresolved',
  /** Discrepancy (e.g. amount/currency mismatch, contradictory statuses) escalated for compliance/ops review. (Integer: 7) */
  ManualReview: 'ManualReview',
  /** Integer value: 8 */
  FailedPermanently: 'FailedPermanently',
});

/**
 * Numeric values for ReconciliationStatus
 */
export const ReconciliationStatusValues = Object.freeze({
  NotRequired: 0,
  Pending: 1,
  InProgress: 2,
  ResolvedSuccess: 3,
  ResolvedFailure: 4,
  ResolvedReversed: 5,
  Unresolved: 6,
  ManualReview: 7,
  FailedPermanently: 8,
});

/**
 * Reconciliation not required (operation finalized synchronously or via standard webhook).</summary>     NotRequired = 0,       <summary>Reconciliation scheduled or awaiting next provider query.</summary>     Pending = 1,       <summary>Reconciliation actively in progress / claimed by worker.</summary>     InProgress = 2,       <summary>Definitively resolved as successful external execution and settled internally.</summary>     ResolvedSuccess = 3,       <summary>Definitively resolved as failed external execution; internal state marked failed safely.</summary>     ResolvedFailure = 4,       <summary>Resolved through refund or reversal settlement.</summary>     ResolvedReversed = 5,       <summary>External outcome remains ambiguous after bounded retry attempts.</summary>     Unresolved = 6,       <summary>Discrepancy (e.g. amount/currency mismatch, contradictory statuses) escalated for compliance/ops review.</summary>     ManualReview = 7,       <summary>Reconciliation failed permanently due to irrecoverable technical or data error.</summary>     FailedPermanently = 8 }   <summary>  Classifies the financial or compliance operation undergoing reconciliation.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const ReconciliationType = Object.freeze({
  /** Outbound payment attempt on bank transfer / disbursement rail. (Integer: 1) */
  PaymentAttempt: 'PaymentAttempt',
  /** Parent bank transfer payout aggregate. (Integer: 2) */
  BankTransfer: 'BankTransfer',
  /** Inbound wallet funding via virtual accounts or reserved accounts. (Integer: 3) */
  InboundFunding: 'InboundFunding',
  /** Inbound card funding payment. (Integer: 4) */
  CardFunding: 'CardFunding',
  /** Card payment refund or chargeback reversal. (Integer: 5) */
  CardRefund: 'CardRefund',
  /** Value-added service (airtime/data) purchase. (Integer: 6) */
  VasPurchase: 'VasPurchase',
  /** Integer value: 7 */
  ComplianceVerification: 'ComplianceVerification',
});

/**
 * Numeric values for ReconciliationType
 */
export const ReconciliationTypeValues = Object.freeze({
  PaymentAttempt: 1,
  BankTransfer: 2,
  InboundFunding: 3,
  CardFunding: 4,
  CardRefund: 5,
  VasPurchase: 6,
  ComplianceVerification: 7,
});

/**
 * Status of an outstanding financial recovery owed by an account holder.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const RecoveryStatus = Object.freeze({
  /** Recovery record open and awaiting balance recovery. (Integer: 1) */
  Pending: 'Pending',
  /** Partial amount recovered; remaining balance outstanding. (Integer: 2) */
  PartiallyRecovered: 'PartiallyRecovered',
  /** Fully settled and reconciled. (Integer: 3) */
  FullyRecovered: 'FullyRecovered',
  /** Uncollectible and written off by finance executive approval. (Integer: 4) */
  WrittenOff: 'WrittenOff',
  /** Integer value: 5 */
  Disputed: 'Disputed',
});

/**
 * Numeric values for RecoveryStatus
 */
export const RecoveryStatusValues = Object.freeze({
  Pending: 1,
  PartiallyRecovered: 2,
  FullyRecovered: 3,
  WrittenOff: 4,
  Disputed: 5,
});

/**
 * Lifecycle qualification status of a referred user relationship.
 * Namespace: CebizPay.Domain.Referrals.Enums
 */
export const ReferralQualificationStatus = Object.freeze({
  /** Pending completion of KYC Tier 1 and minimum qualifying deposit. (Integer: 1) */
  Pending: 'Pending',
  /** Successfully satisfied all mandatory qualification milestones. (Integer: 2) */
  Qualified: 'Qualified',
  /** Integer value: 3 */
  Disqualified: 'Disqualified',
});

/**
 * Numeric values for ReferralQualificationStatus
 */
export const ReferralQualificationStatusValues = Object.freeze({
  Pending: 1,
  Qualified: 2,
  Disqualified: 3,
});

/**
 * Reward entitlement eligibility state for a qualified referral relationship.
 * Namespace: CebizPay.Domain.Referrals.Enums
 */
export const ReferralRewardEligibility = Object.freeze({
  /** Awaiting referral qualification milestones. (Integer: 1) */
  Pending: 'Pending',
  /** Fully eligible for future reward activation when financial rewards are enabled. (Integer: 2) */
  Eligible: 'Eligible',
  /** Under risk review; reward eligibility suspended pending manual or AML review. (Integer: 3) */
  HeldForRiskReview: 'HeldForRiskReview',
  /** Qualified referral, but referring user has reached the maximum successful referral limit. (Integer: 4) */
  CapacityExceeded: 'CapacityExceeded',
  /** Integer value: 5 */
  Ineligible: 'Ineligible',
});

/**
 * Numeric values for ReferralRewardEligibility
 */
export const ReferralRewardEligibilityValues = Object.freeze({
  Pending: 1,
  Eligible: 2,
  HeldForRiskReview: 3,
  CapacityExceeded: 4,
  Ineligible: 5,
});

/**
 * State lifecycle for future referral reward entitlements.  Financial activation is strictly disabled in Phase 6D.
 * Namespace: CebizPay.Domain.Referrals.Enums
 */
export const ReferralRewardStatus = Object.freeze({
  /** Reward entitlement pending qualification. (Integer: 1) */
  Pending: 'Pending',
  /** Reward entitlement validated and eligible; awaiting future financial activation. (Integer: 2) */
  Eligible: 'Eligible',
  /** Reward entitlement held pending anti-abuse or risk investigation. (Integer: 3) */
  HeldForRiskReview: 'HeldForRiskReview',
  /** Reward entitlement prepared for financial settlement batch in a future phase. (Integer: 4) */
  ReadyForActivation: 'ReadyForActivation',
  /** Reward financially activated and credited (UNREACHABLE in Phase 6D). (Integer: 5) */
  Activated: 'Activated',
  /** Integer value: 6 */
  Rejected: 'Rejected',
});

/**
 * Numeric values for ReferralRewardStatus
 */
export const ReferralRewardStatusValues = Object.freeze({
  Pending: 1,
  Eligible: 2,
  HeldForRiskReview: 3,
  ReadyForActivation: 4,
  Activated: 5,
  Rejected: 6,
});

/**
 * Frequency of periodic loan repayment installments.
 * Namespace: CebizPay.Domain.Loans.Enums
 */
export const RepaymentFrequency = Object.freeze({
  /** Monthly repayment installment (standard corporate payroll frequency). (Integer: 1) */
  Monthly: 'Monthly',
  /** Weekly repayment installment. (Integer: 2) */
  Weekly: 'Weekly',
  /** Integer value: 3 */
  BiWeekly: 'BiWeekly',
});

/**
 * Numeric values for RepaymentFrequency
 */
export const RepaymentFrequencyValues = Object.freeze({
  Monthly: 1,
  Weekly: 2,
  BiWeekly: 3,
});

/**
 * Authoritative risk rating assigned by the CebizPay Risk Engine.  In accordance with CBN Customer Due Diligence regulations.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const RiskRating = Object.freeze({
  /** Low risk subject (eligible for Simplified / Basic CDD). (Integer: 1) */
  Low: 'Low',
  /** Medium / Standard risk subject (Standard CDD). (Integer: 2) */
  Medium: 'Medium',
  /** High risk subject (mandatory Enhanced Due Diligence and enhanced monitoring). (Integer: 3) */
  High: 'High',
  /** Integer value: 4 */
  Prohibited: 'Prohibited',
});

/**
 * Numeric values for RiskRating
 */
export const RiskRatingValues = Object.freeze({
  Low: 1,
  Medium: 2,
  High: 3,
  Prohibited: 4,
});

/**
 * Target subject of a risk assessment or compliance decision.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const RiskSubjectType = Object.freeze({
  /** Natural person / Individual customer. (Integer: 1) */
  Individual: 'Individual',
  /** Legal entity / Corporate organization. (Integer: 2) */
  Organization: 'Organization',
  /** Integer value: 3 */
  Transaction: 'Transaction',
});

/**
 * Numeric values for RiskSubjectType
 */
export const RiskSubjectTypeValues = Object.freeze({
  Individual: 1,
  Organization: 2,
  Transaction: 3,
});

/**
 * Status of a sales order.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const SalesOrderStatus = Object.freeze({
  /** Draft sales order. (Integer: 0) */
  Draft: 'Draft',
  /** Confirmed sales order awaiting fulfillment. (Integer: 1) */
  Confirmed: 'Confirmed',
  /** Partially fulfilled from inventory. (Integer: 2) */
  PartiallyFulfilled: 'PartiallyFulfilled',
  /** Fully fulfilled and dispatched. (Integer: 3) */
  Fulfilled: 'Fulfilled',
  /** Integer value: 4 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for SalesOrderStatus
 */
export const SalesOrderStatusValues = Object.freeze({
  Draft: 0,
  Confirmed: 1,
  PartiallyFulfilled: 2,
  Fulfilled: 3,
  Cancelled: 4,
});

/**
 * Lifecycle status of a tokenized saved card.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const SavedCardStatus = Object.freeze({
  /** Active and valid for recurring/one-click charges. (Integer: 1) */
  Active: 'Active',
  /** Explicitly revoked or deleted by customer. (Integer: 2) */
  Revoked: 'Revoked',
  /** Card has passed its expiration date. (Integer: 3) */
  Expired: 'Expired',
  /** Integer value: 4 */
  Invalid: 'Invalid',
});

/**
 * Numeric values for SavedCardStatus
 */
export const SavedCardStatusValues = Object.freeze({
  Active: 1,
  Revoked: 2,
  Expired: 3,
  Invalid: 4,
});

/**
 * Status of a savings account / instance.
 * Namespace: CebizPay.Domain.Savings.Enums
 */
export const SavingsAccountStatus = Object.freeze({
  /** Account opened and awaiting initial contribution or activation. (Integer: 1) */
  Pending: 'Pending',
  /** Active savings account accruing interest and/or receiving recurring contributions. (Integer: 2) */
  Active: 'Active',
  /** Account has reached term maturity and is available for full principal and accrued interest withdrawal. (Integer: 3) */
  Matured: 'Matured',
  /** Funds fully liquidated and settled to owner's wallet. (Integer: 4) */
  Withdrawn: 'Withdrawn',
  /** Integer value: 5 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for SavingsAccountStatus
 */
export const SavingsAccountStatusValues = Object.freeze({
  Pending: 1,
  Active: 2,
  Matured: 3,
  Withdrawn: 4,
  Cancelled: 5,
});

/**
 * Contribution frequency for goal-based or recurring savings plans.
 * Namespace: CebizPay.Domain.Savings.Enums
 */
export const SavingsContributionFrequency = Object.freeze({
  /** Daily recurring contribution. (Integer: 1) */
  Daily: 'Daily',
  /** Weekly recurring contribution. (Integer: 2) */
  Weekly: 'Weekly',
  /** Integer value: 3 */
  Monthly: 'Monthly',
});

/**
 * Numeric values for SavingsContributionFrequency
 */
export const SavingsContributionFrequencyValues = Object.freeze({
  Daily: 1,
  Weekly: 2,
  Monthly: 3,
});

/**
 * Ownership entity type for a savings plan or account.
 * Namespace: CebizPay.Domain.Savings.Enums
 */
export const SavingsOwnerType = Object.freeze({
  /** Personal individual saver. (Integer: 1) */
  Individual: 'Individual',
  /** Integer value: 2 */
  Organization: 'Organization',
});

/**
 * Numeric values for SavingsOwnerType
 */
export const SavingsOwnerTypeValues = Object.freeze({
  Individual: 1,
  Organization: 2,
});

/**
 * Type of savings product.
 * Namespace: CebizPay.Domain.Savings.Enums
 */
export const SavingsPlanType = Object.freeze({
  /** Fixed-lock savings plan with committed principal, daily interest accrual, and early withdrawal penalties. (Integer: 1) */
  FixedLock: 'FixedLock',
  /** Integer value: 2 */
  GoalBased: 'GoalBased',
});

/**
 * Numeric values for SavingsPlanType
 */
export const SavingsPlanTypeValues = Object.freeze({
  FixedLock: 1,
  GoalBased: 2,
});

/**
 * Type of inventory stock movement.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const StockMovementType = Object.freeze({
  /** Incoming stock receipt. (Integer: 0) */
  StockIn: 'StockIn',
  /** Outgoing stock issue or fulfillment. (Integer: 1) */
  StockOut: 'StockOut',
  /** Integer value: 2 */
  Adjustment: 'Adjustment',
});

/**
 * Numeric values for StockMovementType
 */
export const StockMovementTypeValues = Object.freeze({
  StockIn: 0,
  StockOut: 1,
  Adjustment: 2,
});

/**
 * Derived stock availability status.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const StockStatus = Object.freeze({
  /** Item is in stock above reorder level. (Integer: 0) */
  InStock: 'InStock',
  /** Item quantity is at or below reorder level. (Integer: 1) */
  LowStock: 'LowStock',
  /** Integer value: 2 */
  OutOfStock: 'OutOfStock',
});

/**
 * Numeric values for StockStatus
 */
export const StockStatusValues = Object.freeze({
  InStock: 0,
  LowStock: 1,
  OutOfStock: 2,
});

/**
 * Lifecycle status of an ERP supplier.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const SupplierStatus = Object.freeze({
  /** Active supplier. (Integer: 0) */
  Active: 'Active',
  /** Integer value: 1 */
  Inactive: 'Inactive',
});

/**
 * Numeric values for SupplierStatus
 */
export const SupplierStatusValues = Object.freeze({
  Active: 0,
  Inactive: 1,
});

/**
 * Authoritative categories for customer support tickets and Kola chatbot triage.
 * Namespace: CebizPay.Domain.Support.Enums
 */
export const SupportTicketCategory = Object.freeze({
  /** Payment transfers, deposit verifications, and transaction failures. (Integer: 1) */
  PaymentOrTransfer: 'PaymentOrTransfer',
  /** Wallet balances, account restrictions, authentication, and access. (Integer: 2) */
  WalletOrAccount: 'WalletOrAccount',
  /** Individual KYC compliance, document submissions, and verification status. (Integer: 3) */
  KycOrVerification: 'KycOrVerification',
  /** Savings plans, thrift cycles, missed contributions, and payouts. (Integer: 4) */
  SavingsOrThrift: 'SavingsOrThrift',
  /** Workforce payroll, corporate expenses, invoicing, and business portal issues. (Integer: 5) */
  BusinessOrWorkplace: 'BusinessOrWorkplace',
  /** Integer value: 6 */
  Other: 'Other',
});

/**
 * Numeric values for SupportTicketCategory
 */
export const SupportTicketCategoryValues = Object.freeze({
  PaymentOrTransfer: 1,
  WalletOrAccount: 2,
  KycOrVerification: 3,
  SavingsOrThrift: 4,
  BusinessOrWorkplace: 5,
  Other: 6,
});

/**
 * Urgency and business severity classification for support tickets.
 * Namespace: CebizPay.Domain.Support.Enums
 */
export const SupportTicketPriority = Object.freeze({
  /** Standard operational priority. (Integer: 1) */
  Normal: 'Normal',
  /** High priority inquiry affecting core user services. (Integer: 2) */
  High: 'High',
  /** Integer value: 3 */
  Critical: 'Critical',
});

/**
 * Numeric values for SupportTicketPriority
 */
export const SupportTicketPriorityValues = Object.freeze({
  Normal: 1,
  High: 2,
  Critical: 3,
});

/**
 * Lifecycle status of a customer support ticket.
 * Namespace: CebizPay.Domain.Support.Enums
 */
export const SupportTicketStatus = Object.freeze({
  /** Ticket is open and awaiting operator review or initial response. (Integer: 1) */
  Open: 'Open',
  /** Ticket has been explicitly escalated by Kola or user due to complexity or severity. (Integer: 2) */
  Escalated: 'Escalated',
  /** Ticket is currently undergoing administrative investigation. (Integer: 3) */
  InReview: 'InReview',
  /** Ticket inquiry has been resolved by operator with documented resolution. (Integer: 4) */
  Resolved: 'Resolved',
  /** Ticket is permanently closed. (Integer: 5) */
  Closed: 'Closed',
  /** Integer value: 6 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for SupportTicketStatus
 */
export const SupportTicketStatusValues = Object.freeze({
  Open: 1,
  Escalated: 2,
  InReview: 3,
  Resolved: 4,
  Closed: 5,
  Cancelled: 6,
});

/**
 * Source used for funding a thrift contribution.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftContributionSource = Object.freeze({
  /** Automated deduction from member's CebizPay wallet. (Integer: 1) */
  Wallet: 'Wallet',
  /** Integer value: 2 */
  CardFallback: 'CardFallback',
});

/**
 * Numeric values for ThriftContributionSource
 */
export const ThriftContributionSourceValues = Object.freeze({
  Wallet: 1,
  CardFallback: 2,
});

/**
 * Status of a member's scheduled contribution in a thrift cycle.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftContributionStatus = Object.freeze({
  /** Scheduled contribution pending collection. (Integer: 1) */
  Pending: 'Pending',
  /** Contribution successfully collected and posted to the central ledger. (Integer: 2) */
  Successful: 'Successful',
  /** Contribution failed (insufficient wallet and card charge failed/declined). (Integer: 3) */
  Missed: 'Missed',
  /** Integer value: 4 */
  Failed: 'Failed',
});

/**
 * Numeric values for ThriftContributionStatus
 */
export const ThriftContributionStatusValues = Object.freeze({
  Pending: 1,
  Successful: 2,
  Missed: 3,
  Failed: 4,
});

/**
 * Status of a specific rotation cycle within a thrift group.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftCycleStatus = Object.freeze({
  /** Upcoming cycle scheduled for future collection. (Integer: 1) */
  Upcoming: 'Upcoming',
  /** Cycle currently collecting scheduled member contributions. (Integer: 2) */
  Collecting: 'Collecting',
  /** Contributions collected; ready for beneficiary payout execution. (Integer: 3) */
  ReadyForPayout: 'ReadyForPayout',
  /** Payout successfully distributed to the designated beneficiary wallet. (Integer: 4) */
  Paid: 'Paid',
  /** Integer value: 5 */
  Failed: 'Failed',
});

/**
 * Numeric values for ThriftCycleStatus
 */
export const ThriftCycleStatusValues = Object.freeze({
  Upcoming: 1,
  Collecting: 2,
  ReadyForPayout: 3,
  Paid: 4,
  Failed: 5,
});

/**
 * Status of a Thrift oversight dispute.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftDisputeStatus = Object.freeze({
  /** Dispute opened and awaiting administrative review. (Integer: 1) */
  Open: 'Open',
  /** Dispute actively under administrative review. (Integer: 2) */
  UnderReview: 'UnderReview',
  /** Dispute resolved with administrative intervention/findings. (Integer: 3) */
  Resolved: 'Resolved',
  /** Integer value: 4 */
  Rejected: 'Rejected',
});

/**
 * Numeric values for ThriftDisputeStatus
 */
export const ThriftDisputeStatusValues = Object.freeze({
  Open: 1,
  UnderReview: 2,
  Resolved: 3,
  Rejected: 4,
});

/**
 * Contribution and payout rotation frequency for a thrift group.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftFrequency = Object.freeze({
  /** Daily thrift cycle. (Integer: 1) */
  Daily: 'Daily',
  /** Weekly thrift cycle. (Integer: 2) */
  Weekly: 'Weekly',
  /** Integer value: 3 */
  Monthly: 'Monthly',
});

/**
 * Numeric values for ThriftFrequency
 */
export const ThriftFrequencyValues = Object.freeze({
  Daily: 1,
  Weekly: 2,
  Monthly: 3,
});

/**
 * Status of an individual member within a thrift group.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftMemberStatus = Object.freeze({
  /** Member invited but has not yet accepted / joined. (Integer: 1) */
  Invited: 'Invited',
  /** Active participating member in good standing. (Integer: 2) */
  Active: 'Active',
  /** Payout eligibility suspended following two consecutive missed contributions. (Integer: 3) */
  Suspended: 'Suspended',
  /** Member removed from group before cycle completion. (Integer: 4) */
  Removed: 'Removed',
  /** Integer value: 5 */
  Refunded: 'Refunded',
});

/**
 * Numeric values for ThriftMemberStatus
 */
export const ThriftMemberStatusValues = Object.freeze({
  Invited: 1,
  Active: 2,
  Suspended: 3,
  Removed: 4,
  Refunded: 5,
});

/**
 * Lifecycle status of a Thrift (Ajo / Esusu) group.
 * Namespace: CebizPay.Domain.Thrift.Enums
 */
export const ThriftStatus = Object.freeze({
  /** Group created and open for invitations and member joins. (Integer: 1) */
  OpenForMembers: 'OpenForMembers',
  /** Members selecting preferred payout positions. (Integer: 2) */
  PositionSelection: 'PositionSelection',
  /** Positions locked; ready for cycle activation. (Integer: 3) */
  Locked: 'Locked',
  /** Active rotation running through cycles. (Integer: 4) */
  Active: 'Active',
  /** All cycles completed and final payouts distributed. (Integer: 5) */
  Completed: 'Completed',
  /** Group cancelled before cycle start. (Integer: 6) */
  Cancelled: 'Cancelled',
  /** Integer value: 7 */
  Paused: 'Paused',
});

/**
 * Numeric values for ThriftStatus
 */
export const ThriftStatusValues = Object.freeze({
  OpenForMembers: 1,
  PositionSelection: 2,
  Locked: 3,
  Active: 4,
  Completed: 5,
  Cancelled: 6,
  Paused: 7,
});

/**
 * Source origin of a message posted to a support ticket thread.  Model supports customer, Kola automated assistant, and administrative operators without requiring a SupportAgent role.
 * Namespace: CebizPay.Domain.Support.Enums
 */
export const TicketMessageSenderType = Object.freeze({
  /** Message originated from the authenticated customer. (Integer: 1) */
  Customer: 'Customer',
  /** Automated message generated by the Kola triage chatbot or system events. (Integer: 2) */
  Kola: 'Kola',
  /** Integer value: 3 */
  Admin: 'Admin',
});

/**
 * Numeric values for TicketMessageSenderType
 */
export const TicketMessageSenderTypeValues = Object.freeze({
  Customer: 1,
  Kola: 2,
  Admin: 3,
});

/**
 * Supported inventory valuation methods.
 * Namespace: CebizPay.Domain.Erp.Enums
 */
export const ValuationMethod = Object.freeze({
  /** Weighted Average Cost. (Integer: 0) */
  Wac: 'Wac',
  /** Integer value: 1 */
  Fifo: 'Fifo',
});

/**
 * Numeric values for ValuationMethod
 */
export const ValuationMethodValues = Object.freeze({
  Wac: 0,
  Fifo: 1,
});

/**
 * Telecommunications network operators supported for VAS operations.
 * Namespace: CebizPay.Domain.Vas.Enums
 */
export const VasNetwork = Object.freeze({
  /** MTN Nigeria. (Integer: 1) */
  Mtn: 'Mtn',
  /** Airtel Nigeria. (Integer: 2) */
  Airtel: 'Airtel',
  /** Globacom (Glo) Nigeria. (Integer: 3) */
  Glo: 'Glo',
  /** Integer value: 4 */
  NineMobile: 'NineMobile',
});

/**
 * Numeric values for VasNetwork
 */
export const VasNetworkValues = Object.freeze({
  Mtn: 1,
  Airtel: 2,
  Glo: 3,
  NineMobile: 4,
});

/**
 * External Value-Added Services (VAS) gateway provider.
 * Namespace: CebizPay.Domain.Vas.Enums
 */
export const VasProvider = Object.freeze({
  /** Integer value: 1 */
  VtuGate: 'VtuGate',
});

/**
 * Numeric values for VasProvider
 */
export const VasProviderValues = Object.freeze({
  VtuGate: 1,
});

/**
 * Status of a VAS purchase operation outcome from an external provider.
 * Namespace: CebizPay.Application.Common.Models.Vas
 */
export const VasPurchaseResultStatus = Object.freeze({
  /** Provider confirmed successful fulfillment. (Integer: 1) */
  Success: 'Success',
  /** Provider rejected the request definitively (e.g. invalid phone number, inactive line). (Integer: 2) */
  BusinessFailure: 'BusinessFailure',
  /** Transient/technical gateway failure (e.g., HTTP 500, network error) eligible for retry. (Integer: 3) */
  TechnicalFailure: 'TechnicalFailure',
  /** Integer value: 4 */
  Unknown: 'Unknown',
});

/**
 * Numeric values for VasPurchaseResultStatus
 */
export const VasPurchaseResultStatusValues = Object.freeze({
  Success: 1,
  BusinessFailure: 2,
  TechnicalFailure: 3,
  Unknown: 4,
});

/**
 * Lifecycle status of a VAS transaction.
 * Namespace: CebizPay.Domain.Vas.Enums
 */
export const VasTransactionStatus = Object.freeze({
  /** Transaction created, pending processing. (Integer: 1) */
  Pending: 'Pending',
  /** Fulfillment is actively processing with external provider. (Integer: 2) */
  Processing: 'Processing',
  /** Transaction completed and fulfilled successfully. (Integer: 3) */
  Succeeded: 'Succeeded',
  /** Transaction failed at provider or validation level. (Integer: 4) */
  Failed: 'Failed',
  /** Fulfillment outcome is indeterminate / timed out (requires reconciliation). (Integer: 5) */
  Unknown: 'Unknown',
  /** Integer value: 6 */
  Reversed: 'Reversed',
});

/**
 * Numeric values for VasTransactionStatus
 */
export const VasTransactionStatusValues = Object.freeze({
  Pending: 1,
  Processing: 2,
  Succeeded: 3,
  Failed: 4,
  Unknown: 5,
  Reversed: 6,
});

/**
 * Categorization of Value-Added Service (VAS) products.
 * Namespace: CebizPay.Domain.Vas.Enums
 */
export const VasType = Object.freeze({
  /** Prepaid mobile airtime top-up. (Integer: 1) */
  Airtime: 'Airtime',
  /** Integer value: 2 */
  Data: 'Data',
});

/**
 * Numeric values for VasType
 */
export const VasTypeValues = Object.freeze({
  Airtime: 1,
  Data: 2,
});

/**
 * Distinct capabilities supported across compliance verification providers.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const VerificationCapability = Object.freeze({
  /** Individual identity verification via BVN or NIN. (Integer: 1) */
  Identity: 'Identity',
  /** Biometric liveness detection and 1:1 facial biometric matching. (Integer: 2) */
  Biometrics: 'Biometrics',
  /** Government-issued identity document OCR and validation (NIMC, Passport, Driver's License, Voter's Card). (Integer: 3) */
  Document: 'Document',
  /** Anti-Money Laundering (AML), Politically Exposed Persons (PEP), and sanctions watchlist screening. (Integer: 4) */
  AmlScreening: 'AmlScreening',
  /** Corporate Affairs Commission (CAC) business registry lookup and director verification. (Integer: 5) */
  Business: 'Business',
  /** Integer value: 6 */
  BeneficialOwnership: 'BeneficialOwnership',
});

/**
 * Numeric values for VerificationCapability
 */
export const VerificationCapabilityValues = Object.freeze({
  Identity: 1,
  Biometrics: 2,
  Document: 3,
  AmlScreening: 4,
  Business: 5,
  BeneficialOwnership: 6,
});

/**
 * Supported external and internal KYC/KYB identity and business verification providers.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const VerificationProvider = Object.freeze({
  /** Dojah identity, verification, and business intelligence platform. (Integer: 1) */
  Dojah: 'Dojah',
  /** Smile ID pan-African identity verification, document OCR, and biometric matching. (Integer: 2) */
  SmileId: 'SmileId',
  /** Ninja compliance and identity verification provider. (Integer: 3) */
  Ninja: 'Ninja',
  /** Integer value: 4 */
  Internal: 'Internal',
});

/**
 * Numeric values for VerificationProvider
 */
export const VerificationProviderValues = Object.freeze({
  Dojah: 1,
  SmileId: 2,
  Ninja: 3,
  Internal: 4,
});

/**
 * Normalized provider-neutral result classification for an external verification check.  External evidence is distinct from final CebizPay compliance approval decisions.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const VerificationResultStatus = Object.freeze({
  /** Identity or business attributes definitively matched official registry. (Integer: 1) */
  Match: 'Match',
  /** Supplied attributes do not match official registry records. (Integer: 2) */
  Mismatch: 'Mismatch',
  /** Identifier (BVN, NIN, CAC) not found in registry. (Integer: 3) */
  NotFound: 'NotFound',
  /** Asynchronous provider job is pending verification. (Integer: 4) */
  Pending: 'Pending',
  /** Provider returned technical failure (HTTP 5xx, network error, upstream failure). (Integer: 5) */
  TechnicalFailure: 'TechnicalFailure',
  /** Provider service or specific verification rail is currently unavailable. (Integer: 6) */
  Unavailable: 'Unavailable',
  /** Provider returned inconclusive or flagged result requiring manual compliance review. (Integer: 7) */
  ReviewRequired: 'ReviewRequired',
  /** Integer value: 8 */
  InvalidRequest: 'InvalidRequest',
});

/**
 * Numeric values for VerificationResultStatus
 */
export const VerificationResultStatusValues = Object.freeze({
  Match: 1,
  Mismatch: 2,
  NotFound: 3,
  Pending: 4,
  TechnicalFailure: 5,
  Unavailable: 6,
  ReviewRequired: 7,
  InvalidRequest: 8,
});

/**
 * Lifecycle status of an internal verification operation.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const VerificationStatus = Object.freeze({
  /** Operation created and awaiting provider dispatch. (Integer: 1) */
  Initiated: 'Initiated',
  /** Provider dispatch is in progress. (Integer: 2) */
  Processing: 'Processing',
  /** Provider initiated asynchronous job; awaiting webhook callback or polling completion. (Integer: 3) */
  PendingCallback: 'PendingCallback',
  /** Verification finished with definitive provider outcome recorded as evidence. (Integer: 4) */
  Completed: 'Completed',
  /** Operation failed technically across all attempted providers without usable evidence. (Integer: 5) */
  Failed: 'Failed',
  /** Provider result or capability policy requires human compliance officer review. (Integer: 6) */
  ReviewRequired: 'ReviewRequired',
  /** Integer value: 7 */
  Cancelled: 'Cancelled',
});

/**
 * Numeric values for VerificationStatus
 */
export const VerificationStatusValues = Object.freeze({
  Initiated: 1,
  Processing: 2,
  PendingCallback: 3,
  Completed: 4,
  Failed: 5,
  ReviewRequired: 6,
  Cancelled: 7,
});

/**
 * Scope of verification subject: natural person (Individual KYC) vs legal entity / legal arrangement (Organization KYB).  In accordance with CBN Customer Due Diligence regulations, individual tiered KYC must never be applied to legal entities.
 * Namespace: CebizPay.Domain.Compliance.Enums
 */
export const VerificationType = Object.freeze({
  /** Natural person individual identity verification (KYC). (Integer: 1) */
  IndividualKyc: 'IndividualKyc',
  /** Integer value: 2 */
  OrganizationKyb: 'OrganizationKyb',
});

/**
 * Numeric values for VerificationType
 */
export const VerificationTypeValues = Object.freeze({
  IndividualKyc: 1,
  OrganizationKyb: 2,
});

/**
 * Lifecycle status of a dedicated/dynamic virtual account.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const VirtualAccountStatus = Object.freeze({
  /** Account creation request submitted to provider, pending assignment. (Integer: 1) */
  Pending: 'Pending',
  /** Account is active and ready to receive inbound funding deposits. (Integer: 2) */
  Active: 'Active',
  /** Account is temporarily suspended from receiving deposits. (Integer: 3) */
  Suspended: 'Suspended',
  /** Integer value: 4 */
  Closed: 'Closed',
});

/**
 * Numeric values for VirtualAccountStatus
 */
export const VirtualAccountStatusValues = Object.freeze({
  Pending: 1,
  Active: 2,
  Suspended: 3,
  Closed: 4,
});

/**
 * Status lifecycle of a generated Payment Voucher.
 * Namespace: CebizPay.Domain.Payroll.Enums
 */
export const VoucherStatus = Object.freeze({
  /** Payment voucher generated upon successful payroll execution. (Integer: 1) */
  Generated: 'Generated',
  /** Voucher marked as paid. (Integer: 2) */
  Paid: 'Paid',
  /** Integer value: 3 */
  Voided: 'Voided',
});

/**
 * Numeric values for VoucherStatus
 */
export const VoucherStatusValues = Object.freeze({
  Generated: 1,
  Paid: 2,
  Voided: 3,
});

/**
 * Status of a financial wallet.
 * Namespace: CebizPay.Domain.Finance.Enums
 */
export const WalletStatus = Object.freeze({
  /** Active wallet capable of transactions. (Integer: 1) */
  Active: 'Active',
  /** Frozen wallet with blocked transactions. (Integer: 2) */
  Frozen: 'Frozen',
  /** Integer value: 3 */
  Closed: 'Closed',
});

/**
 * Numeric values for WalletStatus
 */
export const WalletStatusValues = Object.freeze({
  Active: 1,
  Frozen: 2,
  Closed: 3,
});

/**
 * Status of an ingested provider webhook event in the deduplication and reconciliation pipeline.
 * Namespace: CebizPay.Domain.Payments.Enums
 */
export const WebhookEventStatus = Object.freeze({
  /** Webhook event received and awaiting processing. (Integer: 1) */
  Received: 'Received',
  /** Webhook event successfully verified, processed, and reconciled. (Integer: 2) */
  Processed: 'Processed',
  /** Duplicate webhook event detected and safely acknowledged without re-applying financial effects. (Integer: 3) */
  Duplicate: 'Duplicate',
  /** Webhook event processing failed due to error or invalid state. (Integer: 4) */
  Failed: 'Failed',
  /** Webhook event safely ignored (e.g. unhandled event type or stale out-of-order notification). (Integer: 5) */
  Ignored: 'Ignored',
  /** Event actively claimed and being processed by an asynchronous worker. (Integer: 6) */
  Processing: 'Processing',
  /** Event payload indicates ambiguous provider state; scheduled for status reconciliation. (Integer: 7) */
  RequiresReconciliation: 'RequiresReconciliation',
  /** Discrepancy detected (e.g., amount mismatch, unauthorized reference); requires manual operations review. (Integer: 8) */
  ManualReview: 'ManualReview',
  /** Integer value: 9 */
  DeadLetter: 'DeadLetter',
});

/**
 * Numeric values for WebhookEventStatus
 */
export const WebhookEventStatusValues = Object.freeze({
  Received: 1,
  Processed: 2,
  Duplicate: 3,
  Failed: 4,
  Ignored: 5,
  Processing: 6,
  RequiresReconciliation: 7,
  ManualReview: 8,
  DeadLetter: 9,
});

/**
 * Status of a webhook processing attempt.
 * Namespace: CebizPay.Application.Common.Interfaces.Payments
 */
export const WebhookProcessingStatus = Object.freeze({
  /** Webhook successfully verified and reconciled. (Integer: 1) */
  Processed: 'Processed',
  /** Duplicate webhook safely acknowledged without financial mutation. (Integer: 2) */
  Duplicate: 'Duplicate',
  /** Invalid signature or authentication header. (Integer: 3) */
  InvalidSignature: 'InvalidSignature',
  /** Invalid or malformed JSON payload structure. (Integer: 4) */
  InvalidPayload: 'InvalidPayload',
  /** Webhook safely ignored (unhandled event type or out-of-order stale update). (Integer: 5) */
  Ignored: 'Ignored',
  /** Integer value: 6 */
  Error: 'Error',
});

/**
 * Numeric values for WebhookProcessingStatus
 */
export const WebhookProcessingStatusValues = Object.freeze({
  Processed: 1,
  Duplicate: 2,
  InvalidSignature: 3,
  InvalidPayload: 4,
  Ignored: 5,
  Error: 6,
});

/**
 * Corporate Affairs Commission (CAC) business entity registration classifications.
 */
export const CompanyType = Object.freeze({
  Company: 'COMPANY',
  BusinessName: 'BUSINESS_NAME',
  IncorporatedTrustees: 'INCORPORATED_TRUSTEES',
  LimitedPartnership: 'LIMITED_PARTNERSHIP',
  LimitedLiabilityPartnership: 'LIMITED_LIABILITY_PARTNERSHIP',
});

export const COMPANY_TYPE_OPTIONS = Object.freeze([
  { value: CompanyType.Company, label: 'Limited Liability Company (RC)' },
  { value: CompanyType.BusinessName, label: 'Sole Proprietorship / Enterprise (BN)' },
  { value: CompanyType.IncorporatedTrustees, label: 'NGO / Incorporated Trustees (IT)' },
  { value: CompanyType.LimitedPartnership, label: 'Limited Partnership (LP)' },
  { value: CompanyType.LimitedLiabilityPartnership, label: 'Limited Liability Partnership (LLP)' },
]);

