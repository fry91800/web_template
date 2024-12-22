import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import RawDataTableDeleteButton from "../DataTable/RawDataTableDeleteButton";

interface RawDataTableHeaderProps {
  column: {name: string, type: string} | null;
}
const RawDataTableHeader: React.FC<RawDataTableHeaderProps> = ({column}) => {

  return (
    <p>
        {String(column?.name)}
    </p>
  );
};

export default RawDataTableHeader;
