import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown, Loader2 } from 'lucide-react';
import defaultProfile from '../../assets/default-profile.svg';
import { adminService } from '../../api/services/admin.service.js';

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch Platform Admin KPI Metrics (Total Organizations count)
  const { data: metricsData } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminService.dashboard.getMetrics(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 2. Fetch Organizations Directory list live from backend
  const {
    data: orgsApiData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-organizations', { page: currentPage, search: searchQuery, status: selectedStatus }],
    queryFn: () =>
      adminService.organizations.list({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery,
        status: selectedStatus,
      }),
    staleTime: 30 * 1000,
    retry: false,
  });

  // Transform live organizations data from backend
  const displayedOrganizations = useMemo(() => {
    if (orgsApiData?.items && Array.isArray(orgsApiData.items)) {
      return orgsApiData.items.map((item) => ({
        id: item.id || item.organizationId,
        name: item.name || item.businessName || 'Organization',
        category: item.category || 'N/A',
        email: item.email || item.contactEmail || 'N/A',
        address: item.address || 'N/A',
        status: item.status || 'Verified',
        logoUrl: item.logoUrl || null,
      }));
    }
    return [];
  }, [orgsApiData]);

  // Total count formatted from live backend response
  const totalOrganizationsCount = useMemo(() => {
    if (orgsApiData?.totalCount != null) {
      return Number(orgsApiData.totalCount).toLocaleString('en-US');
    }
    if (metricsData?.totalOrganizations != null) {
      return Number(metricsData.totalOrganizations).toLocaleString('en-US');
    }
    return displayedOrganizations.length.toLocaleString('en-US');
  }, [orgsApiData, metricsData, displayedOrganizations]);

  // Total pages from backend pagination
  const totalPages = useMemo(() => {
    if (orgsApiData?.totalPages != null && orgsApiData.totalPages > 0) {
      return orgsApiData.totalPages;
    }
    return 1;
  }, [orgsApiData]);

  const navigate = useNavigate();

  const handleView = (org) => {
    navigate(`/organization/${org.id}`, { state: { organization: org } });
  };

  // Server-side CSV export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blobData = await adminService.organizations.export({
        search: searchQuery,
        status: selectedStatus,
      });
      const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `organizations_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export organizations:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title with Total Count */}
        <h1 className="text-2xl font-bold text-primary-text px-1">
          Organisations ({totalOrganizationsCount})
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
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleExport}
                loading={isExporting}
                disabled={isExporting || displayedOrganizations.length === 0}
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
                  onApply={(status) => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="w-full relative">
            {isFetching && !isLoading && (
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded-md">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Updating...</span>
              </div>
            )}

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                      <span>Loading organisations...</span>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-rejected">
                      <p className="font-semibold text-sm">Failed to load organisations</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {error?.message || 'Unable to retrieve organisations from the server. Please check your connection.'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : displayedOrganizations.length > 0 ? (
                  displayedOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      {/* Name with Avatar */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                            <img
                              src={org.logoUrl || defaultProfile}
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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
