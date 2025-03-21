const db = require("../models/index");
const userdb = db.user;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await userdb.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userdb.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { email, password } = req.body;
    const user = await userdb.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addTeamToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, roles } = req.body;


    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid user ID or team ID format" });
    }

    const user = await userdb.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const existingTeam = user.team_ids.find(team => team.teamId.toString() === teamId);
    if (existingTeam) {
      console.log(" User is already in this team!");
      return res.status(400).json({ message: "User is already part of this team" });
    }


    user.team_ids.push({ teamId: new mongoose.Types.ObjectId(teamId), roles });
    await user.save();

    console.log("Team added successfully!");
    res.status(200).json({ message: "Team added successfully", user });

  } catch (error) {
    console.error(" Error adding team:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};






exports.getUsersByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid team ID format" });
    }

    const objectIdTeamId = new mongoose.Types.ObjectId(teamId);
    console.log("Converted Team ID:", objectIdTeamId);


    const users = await userdb.find({ "team_ids.teamId": objectIdTeamId }, "-password").lean();


    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found for this team" });
    }


    const usersWithRoles = users.map(user => {
      const teamEntry = user.team_ids.find(team => team.teamId.equals(objectIdTeamId));
      return {
        ...user,
        role: teamEntry ? teamEntry.roles : "User"
      };
    });

    res.status(200).json(usersWithRoles);

  } catch (error) {
    console.error("❌ Error fetching users:", error);


    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};




exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userdb.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
