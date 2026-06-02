'use client';
import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';
import {
  DashboardCardsError,
  DashboardCardsSkeleton,
} from '@/components/dashboard/dashboard-card-skeleton';
import SalesTable from '@/components/dashboard/sales-table';
import { SectionCards } from '@/components/dashboard/section-cards';
import { getDashboard } from '@/services/client/dashboard';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboard,
  });

  // if (isLoading) return <DashboardCardsSkeleton />;
  if (isError) return <DashboardCardsError error={error} />;
  return (
    <>
      {/* Page Title and Description */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        {/* <SectionCards state={data} /> */}
        {isLoading && <DashboardCardsSkeleton />}
        {isError && <DashboardCardsError error={error} />}
        {data && <SectionCards state={data} />}
        <ChartAreaInteractive />
      </div>
      <div className="@container/main">
        <SalesTable />
        {/* <DataTable
          data={data}
          pastPerformanceData={pastPerformanceData}
          keyPersonnelData={keyPersonnelData}
          focusDocumentsData={focusDocumentsData}
        /> */}
      </div>
    </>
  );
};

export default Dashboard;
