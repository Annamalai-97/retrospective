const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Invitation', invitationSchema);
