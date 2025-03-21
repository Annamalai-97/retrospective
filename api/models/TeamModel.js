const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: [String],
    required: true,
  },
  users: [
    {
      name: String,
      email: String,
      role: {
        type: String,
        enum: ["User", "Manager", "Super Admin", "Team Admin"],
        default: "User"
      },
    }
  ],
  isToggle: {
    type: Boolean,
    default: false
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      isRead: {
        type: Boolean,
        default: false
      },
      
    }
  ]
});

const Team = mongoose.model("Team", TeamSchema);
module.exports = Team;
