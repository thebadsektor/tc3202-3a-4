import React from "react";

// Skeleton for stat cards in dashboard
const StatCardSkeleton = () => {
  return (
    <div className="bg-[#1E293B] p-6 rounded-xl">
      <div className="flex items-center">
        <div className="p-3 bg-blue-600/25 rounded-lg">
          <div className="w-8 h-8 bg-[#2D3748] rounded animate-pulse"></div>
        </div>
        <div className="ml-4">
          <div className="h-4 w-24 bg-[#2D3748] rounded animate-pulse mb-2"></div>
          <div className="h-8 w-16 bg-[#2D3748] rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for chart panels
const ChartPanelSkeleton = () => {
  return (
    <div className="bg-[#1E293B] p-6 rounded-xl">
      <div className="h-8 w-48 bg-[#2D3748] rounded animate-pulse mb-6"></div>
      <div className="flex justify-between mb-4">
        <div className="h-8 w-32 bg-[#2D3748] rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-[#2D3748] rounded animate-pulse"></div>
      </div>
      <div className="w-full h-64 bg-[#2D3748] rounded animate-pulse"></div>
    </div>
  );
};

// Main dashboard skeleton loading component
const DashboardSkeletonLoading = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
      </div>
    </>
  );
};

export default DashboardSkeletonLoading;