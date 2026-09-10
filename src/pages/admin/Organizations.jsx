import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown } from 'lucide-react';
import defaultProfile from '../../assets/default-profile.svg';

const MOCK_ORGANIZATIONS = [
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

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side mock filtering for search and status filter
  const filteredOrganizations = useMemo(() => {
    return MOCK_ORGANIZATIONS.filter((org) => {
      const matchesSearch =
        !searchQuery.trim() ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !selectedStatus ||
        org.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleView = (org) => {
    // In design-only phase, provide user feedback without external API calls
    console.log('Viewing organization details:', org);
  };

  const handleExport = () => {
    console.log('Exporting organizations list...');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 mt-5">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary-text px-1">
          Organisations (45)
        </h1>

        {/* Main White Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input on the Left */}
            <div className="w-full sm:w-auto">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search"
                className="w-full sm:w-72"
              />
            </div>

            {/* Actions on the Right: Export and Filter */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleExport}
                className="w-auto px-6 py-2"
              >
                Export
              </Button>

              <div className="relative inline-block">
                <Button
                  variant="primaryLink"
                  size="md"
                  icon={ChevronDown}
                  iconPosition="right"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-auto px-6 py-2"
                  aria-expanded={isFilterOpen}
                  aria-haspopup="dialog"
                >
                  Filter
                </Button>

                {/* Filter Dropdown Popover */}
                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  selectedStatus={selectedStatus}
                  onApply={(status) => setSelectedStatus(status)}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-transparent">
                  <TableHead className="w-1/5">Name</TableHead>
                  <TableHead className="w-1/6">Category</TableHead>
                  <TableHead className="w-1/4">Email Address</TableHead>
                  <TableHead className="w-1/6">Address</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      {/* Name with Avatar */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                            <img
                              src={defaultProfile}
                              alt={org.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-primary-text text-sm">
                            {org.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-slate-600 font-normal">
                        {org.category}
                      </TableCell>

                      {/* Email Address */}
                      <TableCell className="text-slate-600 font-normal">
                        {org.email}
                      </TableCell>

                      {/* Address */}
                      <TableCell className="text-slate-600 font-normal">
                        {org.address}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={org.status} />
                      </TableCell>

                      {/* Action View Button */}
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleView(org)}
                          className="w-auto px-5 py-1.5 text-xs font-medium rounded-lg"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      No organisations found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={130}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
