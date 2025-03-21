const express = require('express');
const router = express.Router();
const { verifyInvitation } = require('../controllers/invitationController');

router.get('/', verifyInvitation);

module.exports = router;
