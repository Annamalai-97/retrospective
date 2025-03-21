import { useState } from "react";
import { HOST } from "@/app/components/Retroconst"; // Import your API base URL

const useHandleMessageSubmit = (fetchMessages) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMessageSubmit = async (boardId, titleKey, message) => {
    if (!message?.trim()) {
      console.error("Invalid message:", message);
      setError("Message cannot be empty.");
      return;
    }

    if (!boardId || !titleKey) {
      console.error("Missing boardId or titleKey:", { boardId, titleKey });
      setError("Board ID or title key is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        console.error("Missing token or username");
        setError("Authentication details are missing.");
        return;
      }

      const response = await fetch(
        `${HOST}/boards/${boardId}/comments/${titleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token
          },
          body: JSON.stringify({ message, username }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data.message || "Unknown error");
        setError(data.message || "Failed to send message.");
        return;
      }

      console.log("Message sent successfully!");
      fetchMessages(); // Refresh messages after successful submission
    } catch (error) {
      console.error("Error in API request:", error);
      setError("Failed to send message due to a network/server issue.");
    } finally {
      setLoading(false);
    }
  };

  return { handleMessageSubmit, loading, error };
};

export default useHandleMessageSubmit;
