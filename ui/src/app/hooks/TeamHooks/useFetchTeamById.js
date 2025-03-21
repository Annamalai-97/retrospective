import { useState, useEffect } from "react";
import { HOST } from "@/app/components/Retroconst"; // Use a centralized API base URL

const useFetchTeamById = (teamId) => {
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    if (!teamId) return;
    
    setLoading(true);
    setError(null); // Reset error before making a new request

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${HOST}/user/teamusers/${teamId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added authentication header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setTeam([]); // Handle not found case gracefully
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setTeam(data || []); // Ensure it’s always an array
      }
    } catch (err) {
      console.error("Error fetching team data:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  return { team, error, loading, refetch: fetchTeam }; // ✅ Add refetch function
};

export default useFetchTeamById;
