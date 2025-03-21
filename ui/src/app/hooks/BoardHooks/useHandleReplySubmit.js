import { useState } from "react";
import { HOST } from "@/app/components/Retroconst"; // Import API base URL

const useHandleReplySubmit = (fetchMessages) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReplySubmit = async (
    boardId,
    titleKey,
    commentId,
    replyText,
    setMessages,
    setReplyText,
    setReplyInputVisibility
  ) => {
    if (!String(replyText).trim()) {
      setError("Reply cannot be empty.");
      console.error("Reply cannot be empty.");
      return;
    }

    if (!boardId || !titleKey || !commentId) {
      setError("Missing required parameters.");
      console.error("Missing boardId, titleKey, or commentId:", {
        boardId,
        titleKey,
        commentId,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        setError("Authentication details are missing.");
        console.error("Missing token or username.");
        return;
      }

      const response = await fetch(
        `${HOST}/boards/${boardId}/comments/${titleKey}/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token
          },
          body: JSON.stringify({ message: replyText, username }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit reply.");
        console.error("API error:", errorData.message || "Unknown error");
        return;
      }

      const data = await response.json();

      // Ensure the reply object exists
      const newReply = data.reply || {
        _id: data._id,
        username,
        message: replyText,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        const commentsArray = updatedMessages[titleKey] || [];
        const commentIndex = commentsArray.findIndex(
          (comment) => comment._id === commentId
        );

        if (commentIndex === -1) {
          console.error("Comment not found for ID:", commentId);
          return prevMessages;
        }

        const existingReplies = commentsArray[commentIndex].replies || [];
        commentsArray[commentIndex].replies = [...existingReplies, newReply];

        return updatedMessages;
      });

      // Reset input fields after successful reply submission
      setReplyText("");
      setReplyInputVisibility((prev) => ({
        ...prev,
        [commentId]: false,
      }));

    } catch (error) {
      console.error("Error in API request:", error);
      setError("Network/server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { handleReplySubmit, loading, error };
};

export default useHandleReplySubmit;
