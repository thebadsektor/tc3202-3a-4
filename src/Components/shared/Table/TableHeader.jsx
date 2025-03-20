import React from "react";

const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr className="text-gray-400 text-left">
        {columns.map((column, index) => (
          <th key={index} className="px-6 py-3">
            {column.toUpperCase()}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
