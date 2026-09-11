import React from 'react';
import { PiggyBank } from 'lucide-react';

export default function IndividualSavingsTab({ savings = [] }) {
  if (!savings || savings.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <PiggyBank className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-primary-text">No Saving Plans Enrolled</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          This individual does not have any active target or locked saving plans currently.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 py-2">
      {savings.map((plan) => (
        <div key={plan.id} className="py-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-primary-text text-sm sm:text-base">{plan.name}</h4>
            <p className="text-xs text-slate-400">Target: ₦{plan.targetAmount?.toLocaleString()} • {plan.frequency}</p>
          </div>
          <span className="font-bold text-sm text-primary">₦{plan.currentAmount?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
