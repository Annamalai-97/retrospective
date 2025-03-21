import { useState } from "react";
import { HOST } from "@/app/components/Retroconst"; // Centralized API base URL

const useAddUserToTeam = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddTeam = async (userId, teamId, roles, onSuccess = () => {}) => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage(" Authentication token is missing.");
        setLoading(false);
        return;
      }

      console.log("Sending request to backend:", { teamId, roles });

      const response = await fetch(`${HOST}/user/users/${userId}/add-team`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ teamId, roles }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.message || "Failed to add user to team.");
      }

      setMessage(" User added to team successfully!");
      onSuccess(); 
    } catch (error) {
      console.error(" Catch Block Error:", error);
      setMessage(error.message || " Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return { handleAddTeam, loading, message, setMessage };
};

export default useAddUserToTeam;
