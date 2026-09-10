import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AnnouncementItem from '../../components/common/AnnouncementItem.jsx';
import KPICard from '../../components/cards/KPICard.jsx';
import WalletCard from '../../components/cards/WalletCard.jsx';
import { Building2, Users, Clock, UserCheck, UserX, PiggyBank } from 'lucide-react';
import EarningChart from '../../components/common/EarningChart.jsx';
import { userService } from '../../api/services/user.service.js';
import { adminService } from '../../api/services/admin.service.js';

const VOLUME_DATA = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 60 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 95 },
  { name: 'May', value: 120 },
  { name: 'Jun', value: 140 },
  { name: 'Jul', value: 130 },
  { name: 'Aug', value: 165 },
  { name: 'Sep', value: 180 },
  { name: 'Oct', value: 175 },
  { name: 'Nov', value: 195 },
  { name: 'Dec', value: 210 },
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Scheduled System Maintenance',
    content: 'We will be performing core ledger infrastructure maintenance on Saturday from 2:00 AM to 4:00 AM UTC.',
  },
  {
    id: '2',
    title: 'KYC Tier 2 Verification SLA Update',
    content: 'All submitted business documentation and CAC filings are now reviewed within 2 hours of upload.',
  },
];

const Dashboard = () => {
  // 1. Platform KPI Metrics
  const { data: metricsData } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminService.dashboard.getMetrics(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 2. Platform Master Wallet / Treasury Summary
  const { data: treasuryData } = useQuery({
    queryKey: ['admin-treasury'],
    queryFn: () => adminService.treasury.getSummary(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 3. Platform Revenue Analytics Time Series
  const { data: analyticsData } = useQuery({
    queryKey: ['admin-revenue-analytics'],
    queryFn: () => adminService.analytics.getRevenue(),
    staleTime: 60 * 1000,
    retry: false,
  });

  // 4. Platform Announcements
  const { data: announcementsData } = useQuery({
    queryKey: ['platform-announcements'],
    queryFn: () => userService.getPlatformAnnouncements({ pageSize: 5 }),
    staleTime: 60 * 1000,
    retry: false,
  });

  const announcements = (announcementsData?.items && announcementsData.items.length > 0)
    ? announcementsData.items.slice(0, 2).map((a) => ({
        id: a.id || a.announcementId,
        title: a.title,
        content: a.content || a.summary || a.message || '',
      }))
    : DEFAULT_ANNOUNCEMENTS;

  // Formatted Treasury Values
  const walletBalance = treasuryData?.availableBalance != null
    ? Number(treasuryData.availableBalance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '238,000,909';
  const currencySymbol = treasuryData?.symbol || '₦';

  // Formatted KPI Counts
  const kpis = {
    organizations: metricsData?.totalOrganizations != null
      ? Number(metricsData.totalOrganizations).toLocaleString('en-US')
      : '2,345',
    individuals: metricsData?.totalIndividuals != null
      ? Number(metricsData.totalIndividuals).toLocaleString('en-US')
      : '10,000',
    pendingUsers: metricsData?.pendingKycUsers != null
      ? Number(metricsData.pendingKycUsers).toLocaleString('en-US')
      : '9',
    activeUsers: metricsData?.activeUsers != null
      ? Number(metricsData.activeUsers).toLocaleString('en-US')
      : '900',
    rejectedUsers: metricsData?.rejectedKycUsers != null
      ? Number(metricsData.rejectedKycUsers).toLocaleString('en-US')
      : '87',
    savingPlans: metricsData?.activeSavingPlans != null
      ? Number(metricsData.activeSavingPlans).toLocaleString('en-US')
      : '34',
  };

  // Formatted Chart Series
  const totalRevenue = analyticsData?.totalRevenue != null
    ? Number(analyticsData.totalRevenue).toLocaleString('en-US')
    : '3,445';
  const totalVolume = analyticsData?.totalTransactionVolume != null
    ? Number(analyticsData.totalTransactionVolume).toLocaleString('en-US')
    : '128,450';

  const momGrowthRate = analyticsData?.momGrowthRate != null
    ? `${analyticsData.momGrowthRate >= 0 ? '+' : ''}${analyticsData.momGrowthRate}%`
    : '-3.4%';

  const revenueSeries = (analyticsData?.monthlyData && analyticsData.monthlyData.length > 0)
    ? analyticsData.monthlyData.map((d) => ({ name: d.name, value: d.revenue }))
    : undefined;

  const volumeSeries = (analyticsData?.monthlyData && analyticsData.monthlyData.length > 0)
    ? analyticsData.monthlyData.map((d) => ({ name: d.name, value: d.volume }))
    : VOLUME_DATA;

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 sm:space-y-8">
        {/* Top Section: Wallet + Recent Announcements */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-h-54 h-auto lg:h-54 px-0 sm:px-2 lg:px-5">
          <WalletCard
            balance={walletBalance}
            currency={currencySymbol}
            className="w-full lg:w-1/2 h-auto lg:h-full"
          />
          <div className="flex flex-col rounded-xl space-y-4 w-full lg:w-1/2 bg-white border border-primary shadow-2xl p-5 justify-between">
            <h2 className="text-sm text-primary font-semibold">Recent Announcements</h2>
            <div className="flex flex-col space-y-4">
              {announcements.map((item) => (
                <AnnouncementItem
                  key={item.id}
                  title={item.title}
                  description={item.content}
                />
              ))}
            </div>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 px-0 sm:px-2 lg:px-5">
          <KPICard title="Organizations" value={kpis.organizations} icon={Building2} />
          <KPICard title="Individuals" value={kpis.individuals} icon={Users} />
          <KPICard title="Pending Users" value={kpis.pendingUsers} icon={Clock} />
          <KPICard title="Active users" value={kpis.activeUsers} icon={UserCheck} />
          <KPICard title="Rejected Users" value={kpis.rejectedUsers} icon={UserX} />
          <KPICard title="Saving Plans" value={kpis.savingPlans} icon={PiggyBank} />
        </div>

        {/* Analytical Charts */}
        <div className="flex flex-col xl:flex-row gap-6 px-0 sm:px-2 lg:px-5">
          <EarningChart
            title="Platform Revenue"
            totalEarnings={totalRevenue}
            currency={currencySymbol}
            growthRate={momGrowthRate}
            data={revenueSeries}
            className="w-full xl:w-1/2"
          />
          <EarningChart
            title="Transaction Volume"
            totalEarnings={totalVolume}
            currency={currencySymbol}
            growthRate={momGrowthRate}
            data={volumeSeries}
            className="w-full xl:w-1/2"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;