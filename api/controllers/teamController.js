const Team = require("../models/TeamModel");

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.users.some((user) => user.email === req.user.email);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied! Not part of this team." });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, admin } = req.body;
    const existingTeam = await Team.findOne({ name,admin});

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const team = new Team({
      name,
      admin
    });

    await team.save();
    res.status(201).json({ message: "Team created successfully!", team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeamsByUser = async (req, res) => {
  try {
    const teams = await Team.find({ "users.email": req.user.email });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {


    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedTeam) return res.status(404).json({ message: "Team not found" });


    res.status(200).json(updatedTeam);
  } catch (error) {

    res.status(500).json({ message: "Server Error", error });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ message: "Team not found" });

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
   
    res.status(500).json({ message: "Server Error", error });
  }
};



