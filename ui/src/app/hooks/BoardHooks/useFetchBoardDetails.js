import { useState, useEffect } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst";

const useFetchBoardDetails = (boardId) => {
  const [boardDetails, setBoardDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!boardId) {
      setError("Board ID is missing.");
      return;
    }

    let isMounted = true;

    const fetchBoardDetails = async () => {
      try {
        console.log(`Fetching board details for ID: ${boardId}`);

        const token = localStorage.getItem("token"); 
        if (!token) {
          setError("Authentication token is missing.");
          return;
        }

        const response = await axios.get(`${HOST}/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (isMounted) {
          setBoardDetails(response.data);
        }
      } catch (err) {
        console.error("Error fetching board details:", err);

        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch board details");
        }
        if(undefined){
        undefined===null
        }
        console.log('null',undefined)
      }
    };

    fetchBoardDetails();

    return () => {
      isMounted = false;
    };
  }, [boardId]);

  return { boardDetails, error };
};

export default useFetchBoardDetails;
