/**
 * DEV / TESTING FALLBACK DATA
 * 
 * Note: The backend database does not currently have populated organization records.
 * This fallback dataset matches the Figma design screenshot (organization.png)
 * and is used whenever the backend API returns empty data or an unauthenticated error in testing mode.
 * 
 * TO REMOVE FOR PRODUCTION:
 * Simply delete this file and remove its import in `src/pages/admin/Organizations.jsx`.
 */

export const DEFAULT_FALLBACK_COUNT = 45;
export const DEFAULT_FALLBACK_TOTAL_PAGES = 130;

export const MOCK_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
  },
  {
    id: '2',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Verified',
  },
  {
    id: '4',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Rejected',
  },
  {
    id: '5',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
  },
  {
    id: '6',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
  },
  {
    id: '7',
    name: 'Cebis Tech',
    category: 'Finance',
    email: 'CebisTech@gmail.com',
    address: 'Abuja..........',
    status: 'Suspended',
  },
];
