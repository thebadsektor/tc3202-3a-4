import React from "react";
import UsersTable from "./UsersTable";
import SkeletonLoading from "./shared/SkeletonLoading";

const UsersTab = () => {
  return (
    <div className="space-y-6">
      <UsersTable />
    </div>
  );
};

export default UsersTab;
