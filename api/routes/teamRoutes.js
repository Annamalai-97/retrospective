const express = require("express");
const { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require("../controllers/teamController");
const { authMiddleware } = require("../controllers/authController");

const router = express.Router();

router.get("/",authMiddleware,getTeams);
router.get("/:id",authMiddleware,getTeamById);
router.post("/addteam",authMiddleware, createTeam);
router.put("/update/:id",authMiddleware, updateTeam);
router.delete("/:id",authMiddleware, deleteTeam);

module.exports = router;
