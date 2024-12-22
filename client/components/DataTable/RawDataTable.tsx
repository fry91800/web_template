import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import RawDataTableDeleteButton from "../DataTable/RawDataTableDeleteButton";
import RawDataTableHeader from "../DataTable/RawDataTableHeader";
import RawDataTableCell from "../DataTable/RawDataTableCell";

interface RawDataTableProps {
  data: { columns: any[]; data: any[] } | null;
  handleDelete: (id: string) => void;
}
const RawDataTable: React.FC<RawDataTableProps> = ({data, handleDelete}) => {

  return (
    <table className={styles.table} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th key="delete" style={{ padding: "8px", textAlign: "left" }}>x</th>
          {data?.columns.map((header, index) => (
            <th key={index} style={{ padding: "8px", textAlign: "left" }}>
              <RawDataTableHeader column={header}/>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td key="delete" style={{ padding: "8px" }}>
              <RawDataTableDeleteButton id={row.id} handleDelete={handleDelete} />
            </td>
            {data?.columns.map((header, index) => (
              <td key={index} style={{ padding: "8px" }}>
                <RawDataTableCell content={row[header.name]}/>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RawDataTable;
