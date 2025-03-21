"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst";

const useFetchBoards = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token

        if (!token) {
          console.error("No token found. User may not be logged in.");
          setError("Authentication required.");
          return;
        }

        const response = await axios.get(`${HOST}/boards`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        });

        setBoards(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching boards");
        console.error("Error fetching boards:", error.response || error.message);
      }
    };

    fetchBoards();
  }, []);

  const removeBoardFromState = (boardId) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board._id !== boardId));
  };

  return { boards, error, removeBoardFromState };
};

export default useFetchBoards;
