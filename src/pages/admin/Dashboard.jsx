import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AnnouncementItem from '../../components/common/AnnouncementItem.jsx';
import KPICard from '../../components/cards/KPICard.jsx';
import WalletCard from '../../components/cards/WalletCard.jsx';
import { Building2, Users, Clock, UserCheck, UserX, PiggyBank, Loader2 } from 'lucide-react';
import EarningChart from '../../components/common/EarningChart.jsx';
import { userService } from '../../api/services/user.service.js';
import { adminService } from '../../api/services/admin.service.js';

const Dashboard = () => {
  // 1. Platform KPI Metrics
  const {
    data: metricsData,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
  } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminService.dashboard.getMetrics(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 2. Platform Master Wallet / Treasury Summary
  const {
    data: treasuryData,
    isLoading: isTreasuryLoading,
    isError: isTreasuryError,
    error: treasuryError,
  } = useQuery({
    queryKey: ['admin-treasury'],
    queryFn: () => adminService.treasury.getSummary(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 3. Platform Revenue Analytics Time Series
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    error: analyticsError,
  } = useQuery({
    queryKey: ['admin-revenue-analytics'],
    queryFn: () => adminService.analytics.getRevenue(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 4. Platform Announcements
  const {
    data: announcementsData,
    isLoading: isAnnouncementsLoading,
    isError: isAnnouncementsError,
    error: announcementsError,
  } = useQuery({
    queryKey: ['platform-announcements'],
    queryFn: () => userService.getPlatformAnnouncements({ pageSize: 5 }),
    staleTime: 60 * 1000,
    retry: false,
  });

  const announcements = useMemo(() => {
    if (announcementsData?.items && Array.isArray(announcementsData.items)) {
      return announcementsData.items.slice(0, 2).map((a) => ({
        id: a.id || a.announcementId,
        title: a.title,
        content: a.content || a.summary || a.message || '',
      }));
    }
    return [];
  }, [announcementsData]);

  // Formatted Treasury Values
  const walletBalance = useMemo(() => {
    if (treasuryData?.availableBalance != null) {
      return Number(treasuryData.availableBalance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return '0.00';
  }, [treasuryData]);

  const currencySymbol = treasuryData?.symbol || '₦';

  // Formatted KPI Counts
  const kpis = useMemo(() => ({
    organizations: metricsData?.totalOrganizations != null
      ? Number(metricsData.totalOrganizations).toLocaleString('en-US')
      : '0',
    individuals: metricsData?.totalIndividuals != null
      ? Number(metricsData.totalIndividuals).toLocaleString('en-US')
      : '0',
    pendingUsers: metricsData?.pendingKycUsers != null
      ? Number(metricsData.pendingKycUsers).toLocaleString('en-US')
      : '0',
    activeUsers: metricsData?.activeUsers != null
      ? Number(metricsData.activeUsers).toLocaleString('en-US')
      : '0',
    rejectedUsers: metricsData?.rejectedKycUsers != null
      ? Number(metricsData.rejectedKycUsers).toLocaleString('en-US')
      : '0',
    savingPlans: metricsData?.activeSavingPlans != null
      ? Number(metricsData.activeSavingPlans).toLocaleString('en-US')
      : '0',
  }), [metricsData]);

  // Formatted Chart Series
  const totalRevenue = useMemo(() => {
    if (analyticsData?.totalRevenue != null) {
      return Number(analyticsData.totalRevenue).toLocaleString('en-US');
    }
    return '0';
  }, [analyticsData]);

  const totalVolume = useMemo(() => {
    if (analyticsData?.totalTransactionVolume != null) {
      return Number(analyticsData.totalTransactionVolume).toLocaleString('en-US');
    }
    return '0';
  }, [analyticsData]);

  const momGrowthRate = useMemo(() => {
    if (analyticsData?.momGrowthRate != null) {
      return `${analyticsData.momGrowthRate >= 0 ? '+' : ''}${analyticsData.momGrowthRate}%`;
    }
    return '0%';
  }, [analyticsData]);

  const revenueSeries = useMemo(() => {
    if (analyticsData?.monthlyData && Array.isArray(analyticsData.monthlyData)) {
      return analyticsData.monthlyData.map((d) => ({ name: d.name, value: Number(d.revenue || 0) }));
    }
    return [];
  }, [analyticsData]);

  const volumeSeries = useMemo(() => {
    if (analyticsData?.monthlyData && Array.isArray(analyticsData.monthlyData)) {
      return analyticsData.monthlyData.map((d) => ({ name: d.name, value: Number(d.volume || 0) }));
    }
    return [];
  }, [analyticsData]);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 sm:space-y-8">
        {/* Top Section: Wallet + Recent Announcements */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-h-54 h-auto lg:h-54 px-0 sm:px-2 lg:px-5">
          <WalletCard
            balance={walletBalance}
            currency={currencySymbol}
            isLoading={isTreasuryLoading}
            isError={isTreasuryError}
            errorMessage={treasuryError?.message}
            className="w-full lg:w-1/2 h-auto lg:h-full"
          />
          <div className="flex flex-col rounded-xl space-y-4 w-full lg:w-1/2 bg-white border border-primary shadow-2xl p-5 justify-between min-h-48">
            <h2 className="text-sm text-primary font-semibold">Recent Announcements</h2>
            {isAnnouncementsLoading ? (
              <div className="flex-1 flex items-center justify-center py-6 text-slate-400 space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs">Loading announcements...</span>
              </div>
            ) : isAnnouncementsError ? (
              <div className="flex-1 flex items-center justify-center py-6 text-center text-xs text-rejected">
                {announcementsError?.message || 'Failed to load announcements.'}
              </div>
            ) : announcements.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {announcements.map((item) => {
                  console.log('Announcement Item:', item); // Debugging log
                  return (
                  <AnnouncementItem
                    key={item.id}
                    title={item.title}
                    description={item.description}
                  />
                )})}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400 text-xs sm:text-sm">
                No recent announcements.
              </div>
            )}
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 px-0 sm:px-2 lg:px-5">
          <KPICard title="Organizations" value={kpis.organizations} icon={Building2} isLoading={isMetricsLoading} isError={isMetricsError} />
          <KPICard title="Individuals" value={kpis.individuals} icon={Users} isLoading={isMetricsLoading} isError={isMetricsError} />
          <KPICard title="Pending Users" value={kpis.pendingUsers} icon={Clock} isLoading={isMetricsLoading} isError={isMetricsError} />
          <KPICard title="Active users" value={kpis.activeUsers} icon={UserCheck} isLoading={isMetricsLoading} isError={isMetricsError} />
          <KPICard title="Rejected Users" value={kpis.rejectedUsers} icon={UserX} isLoading={isMetricsLoading} isError={isMetricsError} />
          <KPICard title="Saving Plans" value={kpis.savingPlans} icon={PiggyBank} isLoading={isMetricsLoading} isError={isMetricsError} />
        </div>

        {/* Analytical Charts */}
        <div className="flex flex-col xl:flex-row gap-6 px-0 sm:px-2 lg:px-5">
          <EarningChart
            title="Platform Revenue"
            totalEarnings={totalRevenue}
            currency={currencySymbol}
            growthRate={momGrowthRate}
            data={revenueSeries}
            isLoading={isAnalyticsLoading}
            isError={isAnalyticsError}
            errorMessage={analyticsError?.message}
            className="w-full xl:w-1/2"
          />
          <EarningChart
            title="Transaction Volume"
            totalEarnings={totalVolume}
            currency={currencySymbol}
            growthRate={momGrowthRate}
            data={volumeSeries}
            isLoading={isAnalyticsLoading}
            isError={isAnalyticsError}
            errorMessage={analyticsError?.message}
            className="w-full xl:w-1/2"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;