import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import RawDataTableDeleteButton from "../DataTable/RawDataTableDeleteButton";

interface RawDataTableHeaderProps {
  content: string| null;
}
const RawDataTableHeader: React.FC<RawDataTableHeaderProps> = ({content}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(content));
  const [inputValue, setInputValue] = useState(String(content));

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClick = () => {
    setIsEditing(true)
  };
  const handleSubmit = () => {
    console.log("Submitted value:", value);
    // Add your custom logic here
    setValue(inputValue);
    setIsEditing(false)
  };
  return (
    <div>
      {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update the value as user types
            onKeyDown={handleKeyDown}
            autoFocus // Automatically focus the input field
          />
      ) : (
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          {value}
        </div>
      )}
    </div>
  );
};

export default RawDataTableHeader;
