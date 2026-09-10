import React from 'react';

const WalletCard = ({
  title = 'Wallet',
  balance = '238,000,909',
  currency = '₦',
  className = '',
}) => {
  return (
    <div
      className={`bg-white text-primary-text rounded-xl flex flex-col space-y-5 justify-center px-8 py-6 sm:py-8 ${className}`}
    >
      <h2 className="font-semibold">{title}</h2>
      <h1 className="text-3xl font-satoshi sm:text-4xl lg:text-[45px] font-extrabold leading-none tracking-tight">
        {currency}{balance}
      </h1>
    </div>
  );
};

export default WalletCard;