import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown } from 'lucide-react';
import defaultAvatar from '../../assets/Ellipse 3018.svg';

// Isolated Phase 1 Mock Data (easily replaced by live TanStack queries in Phase 2)
import { MOCK_ORGANIZATION_WALLETS } from '../../data/mockWallets.js';

export default function OrganizationWallets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    return MOCK_ORGANIZATION_WALLETS.filter((org) => {
      const matchesSearch =
        !searchQuery.trim() ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        !selectedStatus || org.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const totalCount = 45; // Based on reference design title: Organisations (45)
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleView = (org) => {
    navigate(`/wallets/organization/${org.id}`, { state: { organization: org } });
  };

  const handleExport = () => {
    const headers = 'Name,Current Balance,Total Salary Paid,Total Loan Paid';
    const rows = filteredOrganizations.map((org) =>
      `"${org.name}","₦${org.currentBalance.toLocaleString()}","₦${org.totalSalaryPaid.toLocaleString()}","₦${org.totalLoanPaid.toLocaleString()}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organization_wallets_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title with Total Count matching reference */}
        <h1 className="text-2xl font-bold text-primary-text px-1">
          Organisations ({totalCount})
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

          {/* Organizations Wallets Directory Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Total Salary paid</TableHead>
                  <TableHead>Total Loan paid</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
                            <img
                              src={org.logoUrl || defaultAvatar}
                              alt={org.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-xs sm:text-sm text-primary-text truncate">
                            {org.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600 font-medium">
                        ₦{Number(org.currentBalance).toLocaleString('en-US')}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600 font-medium">
                        ₦{Number(org.totalSalaryPaid).toLocaleString('en-US')}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600 font-medium">
                        ₦{Number(org.totalLoanPaid).toLocaleString('en-US')}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleView(org)}
                          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white rounded-lg px-6 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No organizations found matching your search.
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
            totalItems={totalCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
