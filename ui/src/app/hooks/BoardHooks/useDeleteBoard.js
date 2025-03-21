"use client";

import { useState } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst"; // Import API base URL

const useDeleteBoard = (onDeleteSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteBoard = async (boardId) => {
    console.log("Board ID being deleted:", boardId);
    setLoading(true);
    setError(null);

    if (!boardId) {
      setError("Board ID is required.");
      setLoading(false);
      return { success: false, data: null, error: "Validation error: Missing board ID." };
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return { success: false, data: null, error: "Authentication required." };
      }

      const response = await axios.delete(`${HOST}/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in request
        },
      });

      setLoading(false);

      if (onDeleteSuccess) {
        onDeleteSuccess(boardId);
      }

      return { success: true, data: response.data, error: null };
    } catch (err) {
      console.error("Error deleting board:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to delete board");
      setLoading(false);
      return { success: false, data: null, error: err?.response?.data?.message || "Failed to delete board" };
    }
  };

  return { deleteBoard, loading, error};
};

export default useDeleteBoard;
