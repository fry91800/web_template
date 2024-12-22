import React, { useState, useEffect } from "react";
import styles from "./RawDataTable.module.css";
import RawDataTableDeleteButton from "../DataTable/RawDataTableDeleteButton";

interface RawDataTableFormProps {
    fields: any;
    table: any;
    handleInsert: any;
}

const formToObject = () => {
    const inputs = document.querySelectorAll<HTMLInputElement>('.rawDataInput');
    const data: Record<string, string> = {};
  
    inputs.forEach(input => {
        //TODO refactor that part
        if (input.name !== "createdAt" && input.name !== "updatedAt" && input.name !== "id")
        {
            data[input.name] = input.value;
        }
    });
  
    return data;
  };

  

const RawDataTableForm: React.FC<RawDataTableFormProps> = ({ fields, table, handleInsert }) => {
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent default form submission
        const formData = formToObject();
        handleInsert(formData);
      };
    return (
        <div>
        {fields?.map((field: any) => (
            <input type="text" className="rawDataInput" name={field.name} placeholder={field.name} required/>
          ))}
          <button onClick={handleSubmit} >submit</button>
          </div>
    );
};

export default RawDataTableForm;
