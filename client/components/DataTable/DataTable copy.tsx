import React, { useState, useEffect } from "react";
import styles from "./DataTable.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";

interface DataTableProps {
  data: { table: { columns: any[]; data: any[] } } | null; // Adjust types as needed
}

const DataTable: React.FC<DataTableProps> = (prop) => {
  console.log("prop")
  console.log(prop)
  // Early return for loading state
  if (!prop) {
    return <p>Loading...</p>;
  }
  const {data} = prop
  if (!data) {
    return <p>Loading...</p>;
  }

  // Extract columns and initialize rows from props
  const { columns } = data.table;
  const [rows, setRows] = useState(data.table.data);

  // Update rows if data.table.data changes
  useEffect(() => {
    setRows(data.table.data);
  }, [prop]);

  // Delete handler
  const handleDelete = (id: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <table className={styles.table} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th key="delete" style={{ padding: "8px", textAlign: "left" }}>x</th>
          {columns.map((header, index) => (
            <th key={index} style={{ padding: "8px", textAlign: "left" }}>
              {String(header.name)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td key="delete" style={{ padding: "8px" }}>
              <DeleteButton id={row.id} handleDelete={handleDelete} />
            </td>
            {columns.map((header, index) => (
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
