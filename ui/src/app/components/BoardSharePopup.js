import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const BoardSharePopup = ({ board, onClose }) => {
  const [copySuccess, setCopySuccess] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [boardLink, setBoardLink] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBoardLink(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(boardLink).then(() => {
      setCopySuccess("Link copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const handleAddEmail = (e) => {
    if ((e.key === "Enter" || e.key === ",") && emailInput.trim()) {
      e.preventDefault();
      if (!emailList.includes(emailInput.trim())) {
        setEmailList([...emailList, emailInput.trim()]);
      }
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove));
  };

  const handleSendInvite = async () => {
    if (!emailList.length || !board?.id) {
      alert("Please add at least one email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailList, boardId: board.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setInviteSuccess("Invitation sent successfully.");
        setEmailList([]);
        setTimeout(() => setInviteSuccess(""), 3000);
      } else {
        alert(data.message || "Failed to send invitation.");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40  flex items-center justify-center z-50 p-4">
      <div className="bg-white w-[600px] rounded-xl shadow-xl p-6 relative space-y-5">
        <div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-lg font-semibold">Share Board</h2>
        </div>
        <div className="relative rounded-lg border border-gray-300">
          <input
            type="text"
            value={boardLink}
            readOnly
            className="w-full px-4 py-3 pr-24 rounded-lg focus:outline-none text-sm"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#006ED41F] text-primary text-xs px-3 py-1.5 rounded-md"
          >
            Copy link
          </button>
        </div>
        {copySuccess && (
          <p className="text-green-500 text-xs">{copySuccess}</p>
        )}

        <div className="rounded-lg border border-gray-300 p-2">
          <div className="flex flex-wrap gap-2">
            {emailList.map((email, index) => (
              <span
                key={index}
                className="flex items-center bg-[#B5B5B5] text-sm px-3 py-1 rounded-md"
              >
                {email}
                <IoClose
                  size={16}
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemoveEmail(email)}
                />
              </span>
            ))}
          </div>
          <input
            type="email"
            placeholder="Enter email address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleAddEmail}
            className="w-full px-2 py-2 text-sm focus:outline-none"
          />
        </div>

        <button
          onClick={handleSendInvite}
          className="bg-primary text-white w-full py-2 rounded-md text-sm  transition"
        >
          Invite
        </button>

        {inviteSuccess && (
          <p className="text-green-500 text-center text-xs">{inviteSuccess}</p>
        )}
      </div>
    </div>
  );
};

export default BoardSharePopup;
