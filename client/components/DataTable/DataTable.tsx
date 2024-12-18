import React, { useState, useEffect } from "react";
import styles from "./DataTable.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";

interface DataTableProps {
  data: { table: { columns: any[]; data: any[] } } | null;
}
const DataTable: React.FC<DataTableProps> = ({data}) => {
  
  const handleDelete = (id: string) => {
    alert("handleDelete");
  };

  return (
    <table className={styles.table} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th key="delete" style={{ padding: "8px", textAlign: "left" }}>x</th>
          {data?.table.columns.map((header, index) => (
            <th key={index} style={{ padding: "8px", textAlign: "left" }}>
              {String(header.name)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.table.data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td key="delete" style={{ padding: "8px" }}>
              <DeleteButton id={row.id} handleDelete={handleDelete} />
            </td>
            {data?.table.columns.map((header, index) => (
              <td key={index} style={{ padding: "8px" }}>
                {String(row[header.name])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
