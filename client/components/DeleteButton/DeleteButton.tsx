import React from "react";

interface DeleteButtonProps {
  id: string;
  handleDelete: (id: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id, handleDelete }) => {
  return (
    <button
      onClick={() => handleDelete(id)}
      style={{ cursor: "pointer", color: "red", border: "none", background: "none" }}
    >
      Delete
    </button>
  );
};

export default DeleteButton;