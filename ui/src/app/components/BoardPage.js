import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

const BoardPage = () => {
  const router = useRouter();
  const { boardId, token } = router.query;
  const [boardInfo, setBoardInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("No access token provided.");
      return;
    }

    try {
      const decoded = jwt.decode(token);

      if (!decoded || !decoded.boardName) {
        setError("Invalid token.");
        return;
      }

      setBoardInfo(decoded);
    } catch (err) {
      setError("Failed to verify access token.");
    }
  }, [token]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome to {boardInfo?.boardName}</h1>
      <p>Board ID: {boardId}</p>
      <p>Access the board content here...</p>
    </div>
  );
};

export default BoardPage;
