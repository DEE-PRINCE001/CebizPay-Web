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

export const DEFAULT_FALLBACK_COUNT = 45;
export const DEFAULT_FALLBACK_TOTAL_PAGES = 130;

export const MOCK_CREDENTIALS = [
  { id: '1', title: 'Corporative Association Community' },
  { id: '2', title: 'Corporative Association Community' },
  { id: '3', title: 'Corporative Association Community' },
];

export const MOCK_STAFF_MEMBERS = [
  {
    id: '1',
    name: 'Johnson Mike',
    walletId: '781797168ID',
    bankAccount: '02826893 AC',
    email: 'Mile@gmail.com',
    monthlySalary: '34,9713',
    status: 'Verified',
  },
  {
    id: '2',
    name: 'Johnson Mike',
    walletId: '781797168ID',
    bankAccount: '02826893 AC',
    email: 'Mile@gmail.com',
    monthlySalary: '34,9713',
    status: 'Verified',
  },
  {
    id: '3',
    name: 'Johnson Mike',
    walletId: '781797168ID',
    bankAccount: '02826893 AC',
    email: 'Mile@gmail.com',
    monthlySalary: '34,9713',
    status: 'Verified',
  },
  {
    id: '4',
    name: 'Johnson Mike',
    walletId: '781797168ID',
    bankAccount: '02826893 AC',
    email: 'Mile@gmail.com',
    monthlySalary: '34,9713',
    status: 'Verified',
  },
];

export const MOCK_ORGANIZATIONS = [
  {
    id: '1f9c069f-e192-4aea-b4cb-186aa6a565f3',
    name: 'Acme Global Technologies',
    category: 'Technology',
    email: 'contact@acmeglobal.com',
    address: 'Lagos, Nigeria',
    status: 'Pending',
    staffCount: 56,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '544fec0d-9e1d-4ec5-9304-a9ccb0fe6d22',
    name: 'Apex FinTech Solutions',
    category: 'Finance',
    email: 'info@apexfintech.ng',
    address: 'Abuja, Nigeria',
    status: 'Verified',
    staffCount: 65,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '39815683-299a-4907-837b-3e496c7901fe',
    name: 'Zenith Retail Logistics',
    category: 'Logistics',
    email: 'support@zenithlogistics.com',
    address: 'Port Harcourt, Nigeria',
    status: 'Suspended',
    staffCount: 42,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '1',
    name: 'Cebis Tech',
    category: 'Technology',
    email: 'Cebis Technology',
    address: 'Abuja Obanikoro.......',
    status: 'Suspended',
    staffCount: 56,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '2',
    name: 'Cebis Tech',
    category: 'Technology',
    email: 'Cebis Technology',
    address: 'Abuja Obanikoro.......',
    status: 'Pending',
    staffCount: 56,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '3',
    name: 'Cebis Tech',
    category: 'Technology',
    email: 'Cebis Technology',
    address: 'Abuja Obanikoro.......',
    status: 'Verified',
    staffCount: 65,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '4',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Rejected',
    staffCount: 12,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '5',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
    staffCount: 30,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '6',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
    staffCount: 45,
    credentials: MOCK_CREDENTIALS,
  },
  {
    id: '7',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
    staffCount: 56,
    credentials: MOCK_CREDENTIALS,
  },
];

export function getMockOrganizationById(id) {
  const found = MOCK_ORGANIZATIONS.find((o) => String(o.id) === String(id));
  if (found) return found;
  return MOCK_ORGANIZATIONS[1]; // default pending Cebis Tech
}
