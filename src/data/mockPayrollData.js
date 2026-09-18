/**
 * Mock data for Payroll and Department/Level modules.
 * Structured to be easily swappable with real API responses in Phase 6.
 */

export const MOCK_PAYROLL_METRICS = {
  totalSpendLocal: '238,000,909',
  localCurrencySymbol: '₦',
  localSpendTrend: '43,000.00 Less than a year',

  totalSpendInternational: '238,000,909',
  internationalCurrencySymbol: '₦',
  internationalSpendTrend: '43,000.00 Less than a year',

  totalSpendUsdt: '9',
  usdtCurrencySymbol: 'USDT ',
  usdtSpendTrend: '43,000.00 Less than a year',

  totalEmployeesPaid: '89',
  employeesPaidTrend: '43,000.00 Less than a year',
};

export const MOCK_ANALYTICS_BREAKDOWN = {
  general: [
    {
      id: 'spend-breakdown',
      title: 'Payroll spend breakdown',
      description: '0% of your NGN payroll this year was allocated to paying out salaries',
    },
    {
      id: 'spend-annual',
      title: 'Average payroll spend by annual',
      description: 'On the average, you spent 100% lesser than other companies in your industry (Commerce) last year.',
    },
    {
      id: 'spend-dept',
      title: 'Payroll spend per Department',
      description: '-Infinity% of your NGN payroll this year was allocated to paying out employees in',
    },
  ],
  payrollSpend: [
    {
      id: 'direct-salaries',
      title: 'Direct Salaries Allocation',
      description: '92% allocated towards gross direct salaries and basic allowances.',
    },
    {
      id: 'benefits-tax',
      title: 'Statutory Taxes & Pension',
      description: '8% allocated towards PAYE, NHF, and statutory employee deductions.',
    },
  ],
  salariesAnalytics: [
    {
      id: 'median-salary',
      title: 'Median Monthly Salary',
      description: 'The average median salary across active full-time departments is ₦350,000.',
    },
    {
      id: 'top-earning-dept',
      title: 'Top Earning Department',
      description: 'Engineering and Product account for 44% of total compensation disbursements.',
    },
  ],
  othersAnalytics: [
    {
      id: 'bonus-spend',
      title: 'Discretionary Bonuses & Stipas',
      description: 'Zero discretionary bonuses were processed in the current calendar quarter.',
    },
    {
      id: 'contractors',
      title: 'External Contractor Payouts',
      description: 'Contractor invoices processed through payroll total ₦1,200,000 this quarter.',
    },
  ],
};

export const MOCK_PAYROLL_SCHEDULES = Array.from({ length: 11 }, (_, i) => ({
  id: `sched-${i + 1}`,
  description: 'Lorem ipsum dolor sit',
  paymentDate: '5 May',
  amount: 'NGN 50, 000',
  department: 'Marketing',
}));

export const MOCK_PAYROLL_HISTORY = Array.from({ length: 11 }, (_, i) => ({
  id: `hist-${i + 1}`,
  paymentPeriod: 'Wallet',
  payDate: '4:18 PM 27 May, 2021',
  totalPayment: '3,400,000',
  currency: 'NGN',
  noOfEmployees: 32,
}));

export const MOCK_PAYMENT_BREAKDOWN = Array.from({ length: 11 }, (_, i) => ({
  id: `pay-${i + 1}`,
  recipient: 'Jane A. Smith',
  paymentDate: '5 May',
  amount: 'NGN 300, 000',
  description: 'Lorem ipsum dolor sit',
}));

export const MOCK_PAYMENT_DETAILS = {
  id: '0001C',
  companyName: 'CEBIZPAY TEAM',
  companyAddress: 'Cephas ICT Hub, Under G, Ogbomosho',
  companyEmail: 'cephasfinance@gmail.com',
  companyPhones: '09087222874, 07001112222',

  paymentId: '0001C',
  paymentDate: '2023-08-30 12:09:44',

  receivingBank: 'GTBank',
  accountName: 'Jane Smith',
  email: 'janea@gmail.com',
  address: 'Cephas ICT Hub, Under G, Ogbomosho, Oyo State',

  transactionId: '#21Axcb34',
  amountFormatted: 'NGN300, 000',
  amountNumber: '300,000',
  amountInWords: 'Three hundred thousand naira',
  payingBank: 'Kuda Bank',

  description:
    'Lorem ipsum dolor sit amet consectetur. Enim non facilisi ultrices volutpat auctor. Id ut non viverra neque eu odio. Lectus suspendisse ligula ullamcorper elementum elit aliquet. Odio velit et nibh euismod sit vel. Amet facilisis posuere eu diam sollicitudin fermentum sed cursus. Tellus nisl lacus phasellus consectetur arcu rutrum. Diam nec nec mattis risus. Ac risus euismod eu at arcu ut a lacus. Velit morbi semper eget vehicula non cursus volutpat. Netus eget volutpat egestas mi sodales ut. Est habitant netus amet enim neque phasellus condimentum. Urna morbi ut sit malesuada. Sit amet nisi consequat justo tristique sagittis felis consequat. Egestas est sed proin posuere egestas. In curabitur morbi magna massa ipsum ultrices vulputate nulla. Erat neque nisi aliquet ac sit. Tempus.',
  remarks:
    'Lorem ipsum dolor sit amet consectetur. Enim non facilisi ultrices volutpat auctor. Id ut non viverra neque eu odio. Lectus suspendisse ligula ullamcorper elementum elit aliquet.',
};

export const MOCK_DEPARTMENTS = [
  {
    id: 'dept-1',
    name: 'Digital Marketing',
    roles: ['Digital Marketing Lead', 'SEO Specialist', 'Content Creator'],
  },
  {
    id: 'dept-2',
    name: 'UI/UX Design',
    roles: ['UI/UX Intern', 'Entry Level', 'Mid Level', 'Senior Level'],
  },
  {
    id: 'dept-3',
    name: 'Engineering',
    roles: ['Frontend Developer', 'Backend Developer', 'QA Engineer'],
  },
  {
    id: 'dept-4',
    name: 'Human Resources',
    roles: ['HR Manager', 'Talent Acquisition', 'HR Officer'],
  },
  {
    id: 'dept-5',
    name: 'Accounting & Finance',
    roles: ['Accountant', 'Finance Lead', 'Billing Specialist'],
  },
];

export const MOCK_LEVELS = [
  {
    id: 'lvl-1',
    name: 'Level 1',
    amount: 'NGN 150,000',
    members: ['Adebola John', 'Samuel Peters'],
  },
  {
    id: 'lvl-2',
    name: 'Level 2',
    amount: 'NGN 250,000',
    members: ['Jane Smith', 'David Alabi'],
  },
  {
    id: 'lvl-3',
    name: 'Level 3',
    amount: 'NGN 350,000',
    members: ['Michael Obi', 'Chioma Nwosu'],
  },
  {
    id: 'lvl-4',
    name: 'Level 4',
    amount: 'NGN 500,000',
    members: ['Adebola John', 'Folake Daniels'],
  },
  {
    id: 'lvl-5',
    name: 'Level 5',
    amount: 'NGN 750,000',
    members: ['Babatunde Adeleke'],
  },
];
