import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import RawDataTableDeleteButton from "../DataTable/RawDataTableDeleteButton";

interface RawDataTableCellProps {
  content: string| null;
  handleUpdate: (update: any) => any;
  id: string
  field: string
}
const RawDataTableHeader: React.FC<RawDataTableCellProps> = ({content, handleUpdate, id, field}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(content));
  const [inputValue, setInputValue] = useState(String(content));

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await handleSubmit();
      setIsEditing(false)
    }
  };

  const handleClick = () => {
    setInputValue(value)
    setIsEditing(true)
  };
  const handleSubmit = async () => {
    if (inputValue === value)
    {
      return
    }
    console.log("Submitted value:", inputValue);
    const updateData: any = {};
    updateData[field] = inputValue
    const update: any = {update: updateData, where: {id}};
    const updateResponse = await handleUpdate(update)
    if (updateResponse !== false)
    {
      console.log(updateResponse)
      setValue(updateResponse[field]);
    }
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
