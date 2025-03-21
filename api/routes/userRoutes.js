const express = require("express");
const { getUsers, getUserById, updateUser, getUsersByTeamId, addTeamToUser } = require("../controllers/userController");
const { authMiddleware } = require("../controllers/authController");

const router = express.Router();
router.use(authMiddleware)
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.get("/teamusers/:teamId", getUsersByTeamId);
router.put("/users/:id/add-team", addTeamToUser);

module.exports = router;
