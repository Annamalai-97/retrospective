const db = require("../models/index");
const boarddb = db.board;

const mongoose = require("mongoose");


exports.getBoards = async (req, res) => {
  try {
    const boards = await boarddb.find({ userId: req.userId }).lean();
    res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Failed to retrieve boards. Please try again." });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID format" });
    }

    const board = await boarddb.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateStarredBoard = async (req, res) => {
  try {
    const { userId, boardId, isStarred } = req.body;

    const board = await boarddb.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (isStarred) {
      if (!board.starredBy.includes(userId)) board.starredBy.push(userId);
    } else {
      board.starredBy = board.starredBy.filter((id) => id !== userId);
    }

    await board.save();
    res.status(200).json({ message: "Board starred status updated", board });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.createBoard = async (req, res) => {
  const { boardName, description, titles, type, defaultboard } = req.body;

 
  if (!boardName || !description || !titles || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
   
    const existingBoard = await boarddb.findOne({ boardName });
    if (existingBoard) {
      return res.status(400).json({ message: 'Board with this name already exists' });
    }

  
    const board = new boarddb({
      userId: req.userId,  
      boardName,
      description,
      titles,
      type,
      defaultboard,
    });

    
    const savedBoard = await board.save();
    res.status(201).send(savedBoard);

  } catch (error) {
    console.error("Error saving board to DB:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID format" });
    }

    const board = await boarddb.findByIdAndDelete(id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
  
    res.status(200).json(board);
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addCommentToBoard = async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { message, username } = req.body;
    if (!message || !username) {
      console.error("Missing data:", { message, username });
      return res.status(400).json({ error: "Message and username are required." });
    }

    const board = await boarddb.findById(req.params.boardId);
    if (!board) {
      console.error("Board not found:", req.params.boardId);
      return res.status(404).json({ error: "Board not found." });
    }

    const title = board.titles.find((t) => t.key === req.params.titleKey);
    if (!title) {
      console.error("Title not found:", req.params.titleKey);
      return res.status(404).json({ error: "Title not found." });
    }

    title.comments.push({ username, message });
    await board.save();

    console.log("Comment added successfully");
    res.status(200).json({ success: true, board });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.addReplyToComment = async (req, res) => {
  try {
  
    const { message, username } = req.body;
    const { boardId, titleKey, commentId } = req.params;

    if (!message || !username) {
      return res.status(400).json({ error: "Message and username are required." });
    }

    const board = await boarddb.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }

    const title = board.titles.find((t) => t.key === titleKey);
    if (!title) {
      return res.status(404).json({ error: "Title not found." });
    }

    const comment = title.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    const newReply = {
      username,
      message,
      timestamp: new Date(),
    };

    comment.replies = comment.replies || [];
    comment.replies.push(newReply);

    await board.save();

    console.log("Reply added successfully");
    res.status(200).json({ success: true, reply: newReply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.deleteCommentFromBoard = async (req, res) => {
  try {
    const { boardId, titleKey, commentId } = req.params;
    const board = await boarddb.findById(boardId);
    if (!board) {
      console.error("Board not found:", boardId);
      return res.status(404).json({ error: "Board not found." });
    }

    const title = board.titles.find((t) => t.key === titleKey);
    if (!title) {
      console.error("Title not found:", titleKey);
      return res.status(404).json({ error: "Title not found." });
    }

    const commentIndex = title.comments.findIndex((c) => c._id.toString() === commentId);
    if (commentIndex === -1) {
      console.error("Comment not found:", commentId);
      return res.status(404).json({ error: "Comment not found." });
    }

    title.comments.splice(commentIndex, 1);
    await board.save();

    res.status(200).json({ success: true, message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getAllCommentsFromBoard = async (req, res) => {
  try {
    const { boardId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: "Invalid board ID format" });
    }

    const board = await boarddb.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }


    let allComments = [];
    board.titles.forEach((title) => {
      title.comments.forEach((comment) => {
        allComments.push({
          titleKey: title.key,
          message: comment.message,
          username: comment.username,
          timestamp: comment.timestamp,
          _id: comment._id,
          replies: comment.replies || [],
        });
      });
    });

    res.status(200).json(allComments);

  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
