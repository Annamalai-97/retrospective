import { useEffect, useState } from "react";
import axios from "axios";
import { HOST } from "@/app/components/Retroconst"; // Centralized API URL

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ Authentication token is missing.");
                setError("Authentication required.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${HOST}/user/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsers(response.data);
            } catch (error) {
                console.error("❌ Error fetching users:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};

export default useUsers;
