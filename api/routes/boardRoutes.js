const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { authMiddleware } = require("../controllers/authController");


router.get("/", authMiddleware, boardController.getBoards);
router.get("/:id",authMiddleware, boardController.getBoardById);
router.get("/:boardId/comments/",authMiddleware, boardController.getAllCommentsFromBoard);
router.post("/create",authMiddleware, boardController.createBoard);
router.delete("/:id",authMiddleware, boardController.deleteBoard);
router.post("/:boardId/comments/:titleKey",authMiddleware, boardController.addCommentToBoard);
router.post("/:boardId/comments/:titleKey/:commentId/reply", authMiddleware,boardController.addReplyToComment);
router.delete("/:boardId/titles/:titleKey/comments/:commentId/",authMiddleware, boardController.deleteCommentFromBoard);
router.put("/starred",authMiddleware, boardController.updateStarredBoard);

module.exports = router;
