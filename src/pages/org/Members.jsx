import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import defaultAvatar from '../../assets/Ellipse 3018.svg';
import { organizationService } from '../../api/services/organization.service.js';

export default function Members() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: staffData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['org-staff-roster', currentPage, searchQuery, selectedStatus],
    queryFn: () =>
      organizationService.staff.list({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery.trim(),
        status: selectedStatus,
      }),
    staleTime: 30 * 1000,
  });

  const rawItems = staffData?.items || (Array.isArray(staffData) ? staffData : []);

  const membersList = rawItems.map((m) => ({
    id: m.membershipId || m.id,
    membershipId: m.membershipId || m.id,
    userId: m.userId,
    name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email || 'Staff Member',
    department: m.departmentName || '-',
    position: m.roleTitle || m.role || 'Staff',
    level: m.salaryLevelName || '-',
    email: m.email,
    status: m.status || 'Active',
    avatarUrl: m.avatarUrl || null,
    raw: m,
  }));

  const totalCount = staffData?.totalCount != null ? staffData.totalCount : membersList.length;
  const totalPages = staffData?.totalPages != null ? Math.max(1, staffData.totalPages) : 1;

  const handleView = (member) => {
    navigate(`/org/members/${member.id}`, { state: { member } });
  };

  const handleExport = () => {
    if (!membersList || membersList.length === 0) return;
    const headers = ['Name', 'Department', 'Position', 'Level', 'Email Address', 'Status'];
    const rows = membersList.map((m) => [
      `"${m.name}"`,
      `"${m.department}"`,
      `"${m.position}"`,
      `"${m.level}"`,
      `"${m.email}"`,
      `"${m.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `staff_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title & Add New Member Action */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-text">
            Staff ({totalCount})
          </h1>
          <Link
            to="/org/members/new"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            Add New Member
          </Link>
        </div>

        {/* Main White Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input on Left */}
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

            {/* Actions on Right: Export and Filter */}
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
                  className="w-auto px-6 py-2 whitespace-nowrap"
                >
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4 ml-1 shrink-0" />
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

          {/* Members Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-transparent">
                  <TableHead className="w-1/6">Name</TableHead>
                  <TableHead className="w-1/6">Department</TableHead>
                  <TableHead className="w-1/6">Position</TableHead>
                  <TableHead className="w-1/6">Level</TableHead>
                  <TableHead className="w-1/5">Email Address</TableHead>
                  <TableHead className="w-1/8">Status</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Loading staff roster...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">
                          {error?.message || 'Failed to load staff members.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => refetch()}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : membersList.length > 0 ? (
                  membersList.map((member) => (
                    <TableRow key={member.id}>
                      {/* Name with circular avatar */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                            <img
                              src={member.avatarUrl || defaultAvatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-primary-text text-xs sm:text-sm whitespace-nowrap">
                            {member.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {member.department}
                      </TableCell>

                      {/* Position */}
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {member.position}
                      </TableCell>

                      {/* Level */}
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {member.level}
                      </TableCell>

                      {/* Email Address */}
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {member.email}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={member.status} />
                      </TableCell>

                      {/* Action View Button */}
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleView(member)}
                          className="w-auto px-6 py-1.5 text-xs font-medium rounded-lg"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      No members found matching your search.
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
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </OrgDashboardLayout>
  );
}
