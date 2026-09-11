/**
 * Phase 1 Mock Data for Individual Module.
 * ISOLATED FILE: This entire file can be safely deleted once Phase 2 API endpoints are connected.
 */
import avatarImg from '../assets/Ellipse 3018.svg';
import womanPhoto from '../assets/woman.svg';

export const MOCK_INDIVIDUALS = [
  {
    id: 'ind-01',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Staff',
    companyName: 'Cebis Company',
    status: 'Suspended',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-01',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-02',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Not-a-Staff',
    companyName: 'None',
    status: 'Verified',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-02',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-03',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Not-a-Staff',
    companyName: 'None',
    status: 'Verified',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-03',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-04',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Not-a-Staff',
    companyName: 'None',
    status: 'Rejected',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-04',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-05',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Staff',
    companyName: 'Cebis Company',
    status: 'Pending',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-05',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-06',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Staff',
    companyName: 'Cebis Company',
    status: 'Pending',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-06',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
  {
    id: 'ind-07',
    name: 'Johnson Mile',
    email: 'Mile@gmail.com',
    phoneNumber: '0815275927',
    professionalStatus: 'Staff',
    companyName: 'Cebis Company',
    status: 'Suspended',
    avatarUrl: avatarImg,
    photoUrl: womanPhoto,
    credentials: [
      {
        id: 'doc-07',
        title: 'National Identity Card',
        fileUrl: '',
      },
    ],
  },
];

export const MOCK_INDIVIDUAL_TRANSACTIONS = [
  {
    id: 'tx-01',
    userName: 'Johnson Mike',
    avatarUrl: avatarImg,
    transactionType: 'Send',
    receiverOrSender: '7817971681ID',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'tx-02',
    userName: 'Johnson Mike',
    avatarUrl: avatarImg,
    transactionType: 'Receives',
    receiverOrSender: '7817971681ID',
    method: 'Bank Account',
    accountOrWalletId: '156191667631',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Pending',
  },
  {
    id: 'tx-03',
    userName: 'Johnson Mike',
    avatarUrl: avatarImg,
    transactionType: 'Send',
    receiverOrSender: '7817971681ID',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Reversed',
  },
  {
    id: 'tx-04',
    userName: 'Johnson Mike',
    avatarUrl: avatarImg,
    transactionType: 'Receives',
    receiverOrSender: '7817971681ID',
    method: 'Bank Account',
    accountOrWalletId: '156191667631',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Failed',
  },
];
