import { useState } from "react";
import { HOST } from "@/app/components/Retroconst"; // Import your API host

const useHandleDeleteComment = (fetchMessages) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteComment = async (boardId, titleKey, commentId) => {
    setLoading(true);
    setError(null);

    if (!boardId || !titleKey || !commentId) {
      console.error("Missing parameters:", { boardId, titleKey, commentId });
      setError("Invalid parameters provided for deletion.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${HOST}/boards/${boardId}/titles/${titleKey}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response as JSON
        console.error("API error:", errorData);
        setError(errorData.message || "Error deleting comment.");
        setLoading(false);
        return;
      }

      console.log("Comment deleted successfully!");
      if (fetchMessages) {
        fetchMessages(); // Refresh messages after deletion
      }

    } catch (error) {
      console.error("Error in API request:", error);
      setError("Failed to delete comment due to network/server issue.");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteComment, loading, error };
};

export default useHandleDeleteComment;
