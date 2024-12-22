import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";

interface RawDataTableNewButtonProps {
  handleNew: () => void;
}
const RawDataTableNewButton: React.FC<RawDataTableNewButtonProps> = ({handleNew}) => {

  return (
    <button className={styles.table} onClick={() => handleNew()} style={{ borderCollapse: "collapse", width: "100%" }}>
    </button>
  );
};

export default RawDataTableNewButton;
