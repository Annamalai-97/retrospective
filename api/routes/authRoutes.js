const express = require("express");
const { signup, login,logout, googleSignup } = require("../controllers/authController");

const router = express.Router();

router.post("/google-signup", googleSignup);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
