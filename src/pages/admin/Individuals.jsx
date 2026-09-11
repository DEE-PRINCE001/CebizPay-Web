import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown } from 'lucide-react';
import defaultAvatar from '../../assets/Ellipse 3018.svg';

// Isolated Phase 1 Mock Data (easily replaced by useQuery in Phase 2)
import { MOCK_INDIVIDUALS } from '../../data/mockIndividuals.js';

export default function Individuals() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Filter individuals based on search and status
  const displayedIndividuals = useMemo(() => {
    return MOCK_INDIVIDUALS.filter((ind) => {
      const matchesSearch =
        !searchQuery.trim() ||
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        !selectedStatus || ind.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const totalCount = 42; // Matches design "Individual (42)"

  const handleView = (individual) => {
    navigate(`/individual/${individual.id}`, { state: { individual } });
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title with Total Count */}
        <h1 className="text-2xl font-bold text-primary-text px-1">
          Individual ({totalCount})
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
                disabled={isExporting || displayedIndividuals.length === 0}
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
                    setIsFilterOpen(false);
                  }}
                  selectedStatus={selectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Individuals Directory Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Professional Status</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedIndividuals.length > 0 ? (
                  displayedIndividuals.map((ind) => (
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
                      <TableCell className="text-xs sm:text-sm text-slate-600">
                        {ind.email}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600">
                        {ind.professionalStatus}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-slate-600">
                        {ind.companyName}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ind.status} />
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
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      No individuals found matching your criteria.
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
      </div>
    </DashboardLayout>
  );
}
