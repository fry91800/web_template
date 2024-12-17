import React from "react";

const DataTable = <T extends Record<string, any>>(
  data: any) => {
  // Check if data is null at the beginning
  if (!data) {
    return <p>Loading...</p>; // Or you can return any other fallback UI
  }

  // Now that we know data is not null, we can safely destructure it
  const { headers, data: rows } = data;

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {headers.map((header: any) => (
            <th key={String(header)} style={{ padding: "8px", textAlign: "left" }}>
              {String(header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: any, rowIndex: any) => (
          <tr key={rowIndex}>
            {headers.map((header: any) => (
              <td key={String(header)} style={{ padding: "8px" }}>
                {String(row[header])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
