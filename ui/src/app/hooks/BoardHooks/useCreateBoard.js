"use client";

import { useState } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst"; // Import API base URL

const useCreateBoard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBoard = async (boardData) => {
    console.log("Original board data:", boardData);
  
    const formattedTitles = boardData.titles.map(titleObj => {
      const key = Object.keys(titleObj)[0]; 
      return titleObj[key]; 
    });

    const formattedBoardData = { ...boardData, titles: formattedTitles };

    console.log("Formatted board data being sent:", formattedBoardData);

    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return { success: false, data: null, error: "Authentication required." };
      }

      const response = await axios.post(`${HOST}/boards/create`, formattedBoardData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      return { success: true, data: response.data, error: null };
    } catch (err) {
      console.error("Error creating board:", err); 
      setError(err?.response?.data?.error || "Failed to create board");

      if (err.response) {
        console.error("Server responded with:", err.response.data);
      } else if (err.request) {
        console.error("No response received. Request details:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }

      setLoading(false);
      return { success: false, data: null, error: err?.response?.data?.error || "Failed to create board" };
    }
  };

  return { createBoard, loading, error };
};

export default useCreateBoard;
