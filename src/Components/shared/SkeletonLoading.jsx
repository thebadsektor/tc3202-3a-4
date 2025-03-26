import React from "react";

// Skeleton component for table rows
const SkeletonRow = ({ columns }) => {
  return (
    <tr className="border-b border-[#2D3748]">
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <td key={index} className="px-6 py-4">
            <div className="h-4 bg-[#2D3748] rounded animate-pulse"></div>
          </td>
        ))}
    </tr>
  );
};

// Skeleton for product table
const ProductTableSkeleton = () => {
  return (
    <div className="bg-[#232936] rounded-lg mb-6">
      <div className="p-6 flex justify-between items-center">
        <div className="h-8 w-32 bg-[#2D3748] rounded animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-64 bg-[#2D3748] rounded-lg animate-pulse"></div>
          <div className="h-10 w-36 bg-[#2D3748] rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="max-h-[calc(8*56px)] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1F2A] text-left">
                {[
                  "Image",
                  "Product Name",
                  "Category",
                  "Style",
                  "Edit",
                  "Delete",
                ].map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <div className="h-4 w-20 bg-[#2D3748] rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <SkeletonRow key={index} columns={6} />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Skeleton for category and style tables
const SimpleTableSkeleton = ({ title }) => {
  return (
    <div className="bg-[#232936] rounded-lg mb-6">
      <div className="p-6 flex justify-between items-center">
        <div className="h-8 w-32 bg-[#2D3748] rounded animate-pulse"></div>
        <div className="h-10 w-36 bg-[#2D3748] rounded-lg animate-pulse"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A1F2A] text-left">
              {["Name", "Edit", "Delete"].map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 w-20 bg-[#2D3748] rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonRow key={index} columns={3} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main skeleton loading component for ProductsTab
const SkeletonLoading = () => {
  return (
    <div className="space-y-6">
      <ProductTableSkeleton />
      <SimpleTableSkeleton title="Categories" />
      <SimpleTableSkeleton title="Styles" />
    </div>
  );
};

export default SkeletonLoading;
