import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import defaultAvatar from '../../assets/Ellipse 3018.svg';
import { adminService } from '../../api/services/admin.service.js';

export default function IndividualWallets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Live Query: Fetch individual wallets directory
  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-wallets-individuals', { page: currentPage, search: searchQuery, status: selectedStatus }],
    queryFn: () =>
      adminService.wallets.individuals.list({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery,
        status: selectedStatus,
      }),
    staleTime: 30 * 1000,
    retry: false,
  });

  // Transform live individuals wallet data
  const displayedWallets = useMemo(() => {
    if (apiData?.items && Array.isArray(apiData.items)) {
      return apiData.items.map((item) => ({
        id: item.id || item.individualId,
        name: item.name || item.fullName || 'Individual',
        avatarUrl: item.avatarUrl || null,
        currentBalance: item.currentBalance ?? 0,
        loanRepayable: item.loanRepayable ?? 0,
        currency: item.currency || 'NGN',
        status: item.status || 'Active',
      }));
    }
    return [];
  }, [apiData]);

  const totalPages = useMemo(() => {
    if (apiData?.totalPages != null && apiData.totalPages > 0) {
      return apiData.totalPages;
    }
    return 1;
  }, [apiData]);

  const handleView = (ind) => {
    navigate(`/individual/${ind.id}`, { state: { individual: ind } });
  };

  // Live server-side CSV export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blobData = await adminService.wallets.individuals.export({
        search: searchQuery,
        status: selectedStatus,
      });
      const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `individual_wallets_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export individual wallets:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title matching reference */}
        <h1 className="text-2xl font-bold text-primary-text px-1">
          Individual Wallet
        </h1>

        {/* Main White Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input on the Left */}
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

            {/* Actions on the Right: Export and Filter */}
            <div className="flex items-center space-x-3 self-end sm:self-auto relative">
              <Button
                variant="outline"
                size="md"
                onClick={handleExport}
                loading={isExporting}
                disabled={isExporting || displayedWallets.length === 0}
                className="w-auto px-6 py-2"
              >
                Export
              </Button>

              <div className="relative">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-auto px-6 py-2 flex items-center space-x-2"
                >
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>

                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  onSelect={(status) => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  selectedStatus={selectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Individual Wallets Directory Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Loan Repayable</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && displayedWallets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-xs text-slate-500 font-medium">Loading individual wallets...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError && displayedWallets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-rejected">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-6 h-6 text-rejected" />
                        <span className="text-xs font-medium">
                          {error?.message || 'Failed to load individual wallets.'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayedWallets.length > 0 ? (
                  displayedWallets.map((ind) => (
                    <TableRow key={ind.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
                            <img
                              src={ind.avatarUrl || defaultAvatar}
                              alt={ind.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-xs sm:text-sm text-primary-text truncate">
                            {ind.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600 font-medium">
                        ₦{Number(ind.currentBalance).toLocaleString('en-US')}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600 font-medium">
                        {typeof ind.loanRepayable === 'number'
                          ? `₦${Number(ind.loanRepayable).toLocaleString('en-US')}`
                          : ind.loanRepayable}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleView(ind)}
                          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white rounded-lg px-6 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                      No individual wallets found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={apiData?.totalCount ?? displayedWallets.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
