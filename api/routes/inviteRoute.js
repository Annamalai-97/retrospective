const express = require("express");
const { sendInvitation } = require("../controllers/inviteContoller");

const router = express.Router();

router.post("/", sendInvitation);

module.exports = router;
