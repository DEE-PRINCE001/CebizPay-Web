import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import AuditLogDetailsModal from '../../components/modals/AuditLogDetailsModal.jsx';
import { ChevronDown, Loader2, Eye, ScrollText, User } from 'lucide-react';
import { adminService } from '../../api/services/admin.service.js';

const ACTION_FILTER_OPTIONS = [
  { id: 'all-actions', label: 'All Actions', value: '' },
  { id: 'create', label: 'Create', value: 'Create' },
  { id: 'update', label: 'Update', value: 'Update' },
  { id: 'delete', label: 'Delete', value: 'Delete' },
  { id: 'login', label: 'Login', value: 'Login' },
  { id: 'suspend', label: 'Suspend', value: 'Suspend' },
  { id: 'reactivate', label: 'Reactivate', value: 'Reactivate' },
];

function formatEventTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getActionBadgeStyle(action) {
  const normalized = String(action || '').toLowerCase();
  if (normalized.includes('create') || normalized.includes('add') || normalized.includes('register')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (normalized.includes('update') || normalized.includes('edit') || normalized.includes('modify')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (normalized.includes('delete') || normalized.includes('remove') || normalized.includes('suspend') || normalized.includes('reject')) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (normalized.includes('login') || normalized.includes('auth')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: logsApiData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-audit-logs', { page: currentPage, action: selectedAction, search: searchQuery }],
    queryFn: () =>
      adminService.getAuditLogs({
        pageNumber: currentPage,
        pageSize: 15,
        action: selectedAction || undefined,
      }),
    staleTime: 30 * 1000,
    retry: false,
  });

  const rawItems = logsApiData?.items || [];

  // Filter client-side by search query (actorId, action, resourceType, resourceId, ipAddress)
  const displayedLogs = useMemo(() => {
    if (!Array.isArray(rawItems)) return [];
    if (!searchQuery.trim()) return rawItems;
    const query = searchQuery.toLowerCase().trim();
    return rawItems.filter((item) => {
      const matchAction = item.action?.toLowerCase().includes(query);
      const matchActor = item.actorId?.toLowerCase().includes(query);
      const matchResource = item.resourceType?.toLowerCase().includes(query);
      const matchResourceId = item.resourceId?.toLowerCase().includes(query);
      const matchIp = item.ipAddress?.toLowerCase().includes(query);
      return matchAction || matchActor || matchResource || matchResourceId || matchIp;
    });
  }, [rawItems, searchQuery]);

  const totalLogsCount = useMemo(() => {
    if (logsApiData?.totalCount != null) {
      return Number(logsApiData.totalCount).toLocaleString('en-US');
    }
    return displayedLogs.length.toLocaleString('en-US');
  }, [logsApiData, displayedLogs]);

  const totalPages = useMemo(() => {
    if (logsApiData?.totalPages != null && logsApiData.totalPages > 0) {
      return logsApiData.totalPages;
    }
    return 1;
  }, [logsApiData]);

  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExportCsv = () => {
    try {
      setIsExporting(true);
      if (displayedLogs.length === 0) return;

      const headers = ['ID', 'OccurredAtUtc', 'ActorId', 'Action', 'ResourceType', 'ResourceId', 'IpAddress', 'CorrelationId'];
      const rows = displayedLogs.map((log) => [
        `"${log.id || ''}"`,
        `"${log.occurredAtUtc || ''}"`,
        `"${log.actorId || ''}"`,
        `"${log.action || ''}"`,
        `"${log.resourceType || ''}"`,
        `"${log.resourceId || ''}"`,
        `"${log.ipAddress || ''}"`,
        `"${log.correlationId || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export audit logs:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title with Total Count */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-2xl font-bold text-primary-text">
            Audit Logs ({totalLogsCount})
          </h1>
          {isFetching && !isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Main White Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full sm:w-auto">
              <SearchInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => setSearchQuery('')}
                placeholder="Search action, actor, resource..."
                className="w-full sm:w-80"
              />
            </div>

            {/* Actions: Export & Filter */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleExportCsv}
                loading={isExporting}
                disabled={isExporting || displayedLogs.length === 0}
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
                  className="w-auto px-4 py-2"
                  aria-haspopup="dialog"
                  aria-expanded={isFilterOpen}
                >
                  {selectedAction ? `Action: ${selectedAction}` : 'Filter'}
                </Button>

                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  title="Filter by Action"
                  options={ACTION_FILTER_OPTIONS}
                  selectedValue={selectedAction}
                  onSelect={(val) => {
                    setSelectedAction(val);
                    setCurrentPage(1);
                  }}
                  onApply={(val) => {
                    setSelectedAction(val);
                    setCurrentPage(1);
                  }}
                  showApplyButton={false}
                  align="right"
                />
              </div>
            </div>
          </div>

          {/* Table or States */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500 font-medium">Loading audit logs...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <p className="text-sm font-semibold text-rose-600">
                Failed to load audit logs
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                {error?.message || 'Unable to retrieve administrative audit records at this time.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : displayedLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <ScrollText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No audit logs found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {searchQuery || selectedAction
                  ? 'No audit log entries match your active filters or search keyword.'
                  : 'There are no administrative audit log events recorded yet.'}
              </p>
              {(searchQuery || selectedAction) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedAction('');
                  }}
                  className="text-xs text-primary font-medium hover:underline cursor-pointer pt-1"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Occurred At</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedLogs.map((log) => {
                    const badgeClass = getActionBadgeStyle(log.action);
                    return (
                      <TableRow key={log.id || `${log.occurredAtUtc}-${log.actorId}`}>
                        <TableCell className="text-slate-700 font-medium">
                          {formatEventTime(log.occurredAtUtc)}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2 max-w-[180px]">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-mono text-slate-800 truncate" title={log.actorId || 'N/A'}>
                              {log.actorId || 'System'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}
                          >
                            {log.action || 'Unknown'}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800 text-xs sm:text-sm">
                              {log.resourceType || 'Resource'}
                            </span>
                            {log.resourceId && (
                              <span
                                className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]"
                                title={log.resourceId}
                              >
                                {log.resourceId.slice(0, 12)}...
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-xs text-slate-600">
                          {log.ipAddress || '—'}
                        </TableCell>

                        <TableCell className="text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(log)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer inline-flex items-center justify-center"
                            aria-label="Inspect audit log details"
                            title="Inspect details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {displayedLogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      {/* Audit Log Details Modal */}
      <AuditLogDetailsModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    </DashboardLayout>
  );
}
