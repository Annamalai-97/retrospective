import axios from "axios";
import { HOST } from "@/app/components/Retroconst"; // Centralized API URL

const useTeamActions = (setTeamData, setEdit, setEditTeam) => {
  const token = localStorage.getItem("token");

  const handleSaveTeam = async (teamName) => {
    if (!token) {
      console.error("❌ Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `${HOST}/teams/addteam`,
        { name: teamName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeamData((prevTeams) => [...prevTeams, response.data]);
    } catch (error) {
      console.error("❌ Error creating team:", error.response?.data || error.message);
    }
  };

  const handleUpdateTeam = async (updatedTeam) => {
    if (!token) {
      console.error("❌ Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.put(
        `${HOST}/teams/update/${updatedTeam._id}`,
        { name: updatedTeam.Teamname, admin: updatedTeam.TeamAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeamData((prevTeams) =>
        prevTeams.map((team) =>
          team._id === updatedTeam._id ? response.data : team
        )
      );

      setEdit(false);
      setEditTeam(null);
    } catch (error) {
      console.error("❌ Error updating team:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      console.error("❌ Authentication token is missing.");
      return;
    }

    try {
      await axios.delete(`${HOST}/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeamData((prevTeams) => prevTeams.filter((team) => team._id !== id));
    } catch (error) {
      console.error("❌ Error deleting team:", error.response?.data || error.message);
    }
  };

  return { handleSaveTeam, handleUpdateTeam, handleDelete };
};

export default useTeamActions;
