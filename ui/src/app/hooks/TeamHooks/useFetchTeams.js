import { useState, useEffect } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst"; // Use a centralized API base URL

const useFetchTeams = () => {
    const [teamData, setTeamData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication token is missing.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${HOST}/teams`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Added authentication header
                        "Content-Type": "application/json",
                    },
                });

                setTeamData(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
                setError(error?.response?.data?.message || "Failed to fetch teams");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const filteredData = teamData.filter(
        (team) => team?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return { teamData, setTeamData, searchText, setSearchText, filteredData, loading, error };
};

export default useFetchTeams;
