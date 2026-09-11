/**
 * DEV / TESTING FALLBACK DATA
 * 
 * Note: The backend database does not currently have populated organization records.
 * This fallback dataset matches the Figma design screenshots:
 * - organization.png (Directory listing)
 * - pending-details.png (Pending KYB review view)
 * - active-details.png (Active organization with staff table)
 * - suspended-details.png (Suspended organization view)
 * 
 * TO REMOVE FOR PRODUCTION:
 * Simply delete this file and remove its imports.
 */

export const DEFAULT_FALLBACK_COUNT = 6;
export const DEFAULT_FALLBACK_TOTAL_PAGES = 1;

export const MOCK_CREDENTIALS = [];

export const MOCK_STAFF_MEMBERS = [];

export const MOCK_ORGANIZATIONS = [
  {
    id: '0789e8fe-c8d9-43c9-aef0-598c92a27704',
    name: 'Prime Meridian Trust',
    category: 'Finance',
    email: 'contact@primemeridian.ng',
    address: 'Abuja, Nigeria',
    status: 'Verified',
    staffCount: 0,
    cacNumber: 'RC-6712398',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/meridian_cac.pdf',
    credentials: [
      {
        id: 'cac-01',
        title: 'CAC Certificate (RC-6712398)',
        fileUrl: 'https://storage.cebizpay.com/docs/meridian_cac.pdf',
      },
    ],
  },
  {
    id: '19ce8ec0-c44e-4314-ae43-db2c63fc117a',
    name: 'Silverline Logistics',
    category: 'Logistics',
    email: 'admin@silverline.com',
    address: 'Abuja, Nigeria',
    status: 'Pending',
    staffCount: 0,
    cacNumber: 'RC-5522840',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/silverline_cac.pdf',
    credentials: [
      {
        id: 'cac-06',
        title: 'CAC Certificate (RC-5522840)',
        fileUrl: 'https://storage.cebizpay.com/docs/silverline_cac.pdf',
      },
    ],
  },
  {
    id: '6f3fd537-c58f-4c8a-8f8e-a6fc04af81df',
    name: 'Bluecrest Dynamics',
    category: 'Technology',
    email: 'compliance@bluecrest.ng',
    address: 'Lagos, Nigeria',
    status: 'Rejected',
    staffCount: 0,
    cacNumber: 'RC-3315703',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/bluecrest_cac.pdf',
    credentials: [
      {
        id: 'cac-07',
        title: 'CAC Certificate (RC-3315703)',
        fileUrl: 'https://storage.cebizpay.com/docs/bluecrest_cac.pdf',
      },
    ],
  },
  {
    id: '39815683-299a-4907-837b-3e496c7901fe',
    name: 'Zenith Retail Logistics',
    category: 'Logistics',
    email: 'support@zenithlogistics.com',
    address: 'Port Harcourt, Nigeria',
    status: 'Suspended',
    staffCount: 0,
    cacNumber: 'RC-7890123',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/zenith_cac.pdf',
    credentials: [
      {
        id: 'cac-03',
        title: 'CAC Certificate (RC-7890123)',
        fileUrl: 'https://storage.cebizpay.com/docs/zenith_cac.pdf',
      },
    ],
  },
  {
    id: '1f9c069f-e192-4aea-b4cb-186aa6a565f3',
    name: 'Acme Global Technologies',
    category: 'Technology',
    email: 'contact@acmeglobal.com',
    address: 'Lagos, Nigeria',
    status: 'Verified',
    staffCount: 0,
    cacNumber: 'RC-9876543',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/acme_cac.pdf',
    credentials: [
      {
        id: 'cac-02',
        title: 'CAC Certificate (RC-9876543)',
        fileUrl: 'https://storage.cebizpay.com/docs/acme_cac.pdf',
      },
    ],
  },
  {
    id: '87a98584-5588-48fb-928f-72f32b24bfb3',
    name: 'Vanguard Holdings',
    category: 'Holding Company',
    email: 'audit@vanguardholdings.com',
    address: 'Kano, Nigeria',
    status: 'Verified',
    staffCount: 0,
    cacNumber: 'RC-9988112',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/vanguard_cac.pdf',
    credentials: [
      {
        id: 'cac-04',
        title: 'CAC Certificate (RC-9988112)',
        fileUrl: 'https://storage.cebizpay.com/docs/vanguard_cac.pdf',
      },
    ],
  },
  {
    id: '544fec0d-9e1d-4ec5-9304-a9ccb0fe6d22',
    name: 'Apex FinTech Solutions',
    category: 'Finance',
    email: 'info@apexfintech.ng',
    address: 'Abuja, Nigeria',
    status: 'Verified',
    staffCount: 0,
    cacNumber: 'RC-4561238',
    cacCertificateUrl: 'https://storage.cebizpay.com/docs/apex_cac.pdf',
    credentials: [
      {
        id: 'cac-05',
        title: 'CAC Certificate (RC-4561238)',
        fileUrl: 'https://storage.cebizpay.com/docs/apex_cac.pdf',
      },
    ],
  },
  {
    id: 'fe28e85c-f581-41be-919c-1a7986d38583',
    name: 'Nexus Digital Assets',
    category: 'Digital Assets',
    email: 'test@nexusdigital.io',
    address: 'Ibadan, Nigeria',
    status: 'Verified',
    staffCount: 0,
    credentials: [],
  },
];

const STATUS_OVERRIDES_KEY = 'cebizpay_org_status_overrides';

export function getStoredOrgStatusOverrides() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STATUS_OVERRIDES_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOrgStatusOverride(orgId, status) {
  try {
    const current = getStoredOrgStatusOverrides();
    current[orgId] = status;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(current));
    }
    const found = MOCK_ORGANIZATIONS.find((o) => String(o.id) === String(orgId));
    if (found) {
      found.status = status;
    }
  } catch (e) {
    console.error('Failed to save status override:', e);
  }
}

export function getOrganizationsWithOverrides() {
  const overrides = getStoredOrgStatusOverrides();
  return MOCK_ORGANIZATIONS.map((org) => {
    if (overrides[org.id]) {
      return { ...org, status: overrides[org.id] };
    }
    return org;
  });
}

export function getMockOrganizationById(id) {
  const overrides = getStoredOrgStatusOverrides();
  const found = MOCK_ORGANIZATIONS.find((o) => String(o.id) === String(id));
  if (!found) return null;
  if (overrides[id]) {
    return { ...found, status: overrides[id] };
  }
  return found;
}

