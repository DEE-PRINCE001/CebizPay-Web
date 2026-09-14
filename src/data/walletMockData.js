export const MOCK_VIRTUAL_ACCOUNTS = [
  {
    id: 'wema',
    bankName: 'Wema Bank',
    accountNumber: '0000001200',
    accountName: 'CebizPay - Chinedu Okonkwo',
  },
  {
    id: 'sterling',
    bankName: 'Sterling Bank',
    accountNumber: '0000001200',
    accountName: 'CebizPay - Chinedu Okonkwo',
  },
  {
    id: 'moniepoint',
    bankName: 'Moniepoint',
    accountNumber: '0000001200',
    accountName: 'CebizPay - Chinedu Okonkwo',
  },
];

export const MOCK_BANKS = [
  { code: '033', name: 'United Bank for Africa (UBA)', shortName: 'UBA' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)', shortName: 'GTB' },
  { code: '044', name: 'Access Bank', shortName: 'Access' },
  { code: '057', name: 'Zenith Bank', shortName: 'Zenith' },
  { code: '011', name: 'First Bank of Nigeria', shortName: 'FirstBank' },
  { code: '035', name: 'Wema Bank', shortName: 'Wema' },
  { code: '090110', name: 'Moniepoint MFB', shortName: 'Moniepoint' },
  { code: '090267', name: 'Kuda Bank', shortName: 'Kuda' },
  { code: '090405', name: 'OPay', shortName: 'OPay' },
];

export const MOCK_SAVED_CARDS = [
  {
    id: 'card-1',
    last4: '5643',
    cardType: 'Visa',
    holderName: 'Chinedu Okonkwo',
    expiry: '12/27',
    isDefault: true,
  },
  {
    id: 'card-2',
    last4: '5643',
    cardType: 'Master Card',
    holderName: 'Chinedu Okonkwo',
    expiry: '09/26',
    isDefault: false,
  },
  {
    id: 'card-3',
    last4: '5643',
    cardType: 'Visa',
    holderName: 'Chinedu Okonkwo',
    expiry: '04/28',
    isDefault: false,
  },
  {
    id: 'card-4',
    last4: '5643',
    cardType: 'Visa',
    holderName: 'Chinedu Okonkwo',
    expiry: '11/25',
    isDefault: false,
  },
];

export const MOCK_BENEFICIARIES = {
  bank: [
    {
      accountNumber: '092729197',
      bankCode: '033',
      bankName: 'United Bank for Africa (UBA)',
      shortBankName: 'UBA',
      formattedAccountNumber: 'UBA-092 729 197',
      accountName: 'Johnson Adebiyi',
      confirmedRecipientName: 'Micheal Johnson',
    },
    {
      accountNumber: '0123456789',
      bankCode: '058',
      bankName: 'Guaranty Trust Bank (GTBank)',
      shortBankName: 'GTB',
      formattedAccountNumber: 'GTB-012 345 678',
      accountName: 'Amaka Okafor',
      confirmedRecipientName: 'Amaka Okafor',
    },
  ],
  wallet: [
    {
      walletId: '615541851885',
      formattedWalletId: 'Wallet ID-092 729 197',
      holderName: 'Mike Adenuga',
      confirmedRecipientName: 'Micheal Johnson',
    },
    {
      walletId: '882194726190',
      formattedWalletId: 'Wallet ID-882 194 726',
      holderName: 'Babatunde Fashola',
      confirmedRecipientName: 'Babatunde Fashola',
    },
  ],
};

export const MOCK_SECURITY = {
  validPin: '1234',
  defaultTransferAmount: '23,000',
  defaultFundAmount: '50,000',
};
