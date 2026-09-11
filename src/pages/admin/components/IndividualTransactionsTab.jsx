import React, { useState, useMemo } from 'react';
import SearchInput from '../../../components/forms/SearchInput.jsx';
import Button from '../../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/common/table/index.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import { ChevronDown } from 'lucide-react';
import defaultAvatar from '../../../assets/Ellipse 3018.svg';

export default function IndividualTransactionsTab({
  transactions = [],
  onExport,
  isExporting = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.userName?.toLowerCase().includes(query) ||
        tx.receiverOrSender?.toLowerCase().includes(query) ||
        tx.accountOrWalletId?.toLowerCase().includes(query) ||
        tx.method?.toLowerCase().includes(query) ||
        tx.status?.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Toolbar: Search on Left, Export & Filter on Right */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Search"
            className="w-full sm:w-72"
          />
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <Button
            variant="outline"
            size="md"
            onClick={onExport}
            loading={isExporting}
            disabled={isExporting}
            className="w-auto px-6 py-2"
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="md"
            className="w-auto px-6 py-2 flex items-center space-x-2"
          >
            <span>Filter</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>Reciever/Sender</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Acct/Wallet ID</TableHead>
              <TableHead>Date n Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-slate-100">
                        <img
                          src={tx.avatarUrl || defaultAvatar}
                          alt={tx.userName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-xs sm:text-sm text-primary-text truncate">
                        {tx.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-slate-600">
                    {tx.transactionType}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-slate-600">
                    {tx.receiverOrSender}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-slate-600">
                    {tx.method}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-slate-600">
                    {tx.accountOrWalletId}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                    {tx.dateTime}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  No transactions recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={13}
        totalItems={130}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
