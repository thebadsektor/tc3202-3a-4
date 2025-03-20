import React from "react";

const TableRow = ({ children, className }) => {
  return (
    <tr className={`border-t border-[#374151] ${className || ""}`}>
      {children}
    </tr>
  );
};

const TableCell = ({ children, className }) => {
  return <td className={`px-6 py-4 ${className || ""}`}>{children}</td>;
};

export { TableRow, TableCell };
