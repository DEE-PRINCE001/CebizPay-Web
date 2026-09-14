import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ChevronDown } from 'lucide-react';
import defaultAvatar from '../../assets/Ellipse 3018.svg';

const INITIAL_MEMBERS = [
  {
    id: 'mem-1',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
  {
    id: 'mem-2',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Suspended',
    avatarUrl: null,
  },
  {
    id: 'mem-3',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
  {
    id: 'mem-4',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
  {
    id: 'mem-5',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
  {
    id: 'mem-6',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
  {
    id: 'mem-7',
    name: 'Cebis Tech',
    department: 'Team Lead',
    position: 'IT Designer',
    level: 'Level 2',
    email: 'eamda@gmail.com',
    status: 'Active',
    avatarUrl: null,
  },
];

export default function Members() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMembers = useMemo(() => {
    return INITIAL_MEMBERS.filter((member) => {
      const matchesSearch =
        !searchQuery.trim() ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !selectedStatus || member.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const totalCount = 45;
  const totalPages = 130;

  const handleView = (member) => {
    navigate(`/org/members/${member.id}`, { state: { member } });
  };

  const handleExport = () => {
    if (!filteredMembers || filteredMembers.length === 0) return;
    const headers = ['Name', 'Department', 'Position', 'Level', 'Email Address', 'Status'];
    const rows = filteredMembers.map((m) => [
      `"${m.name}"`,
      `"${m.department}"`,
      `"${m.position}"`,
      `"${m.level}"`,
      `"${m.email}"`,
      `"${m.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff_members_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
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
