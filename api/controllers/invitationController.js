const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const db = require('../models');
const boarddb = db.board;

const verifyInvitation = async (req, res) => {
  const { token, id } = req.query;
  console.log("==== VERIFY INVITATION ROUTE HIT ====", req.query); 

  if (!token || !id) {
    console.log("Missing token or ID:", { token, id });
    return res.status(400).json({ message: "Token and Board ID are required." });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Board ID format:", id);
    return res.status(400).json({ message: "Invalid Board ID format." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    console.log("Decoded Email:", email);
    console.log("Searching for Board ID:", id);

    const board = await boarddb.findOne({
      _id: new mongoose.Types.ObjectId(id),
      "members.email": email,
    });

    if (!board) {
      console.log("Board not found or user is not a member.");
      return res.status(404).json({ message: "User not found in board members." });
    }

    res.status(200).json({
      message: "User verified successfully!",
      email,
      boardId: board._id,
      boardName: board.boardName,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyInvitation };
