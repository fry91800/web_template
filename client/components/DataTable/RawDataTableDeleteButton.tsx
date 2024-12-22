import React from "react";

interface RawDataTableDeleteButtonProps {
  id: string;
  handleDelete: (id: string) => void;
}

const RawDataTableDeleteButton: React.FC<RawDataTableDeleteButtonProps> = ({ id, handleDelete }) => {
  return (
    <button
      onClick={() => handleDelete(id)}
      style={{ cursor: "pointer", color: "red", border: "none", background: "none" }}
    >
      Delete
    </button>
  );
};

export default RawDataTableDeleteButton;