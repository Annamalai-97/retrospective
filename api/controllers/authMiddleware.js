const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    token = token.replace("Bearer ", "");
    let decoded;

    if (token.split(".").length === 3) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (Date.now() / 1000 > decoded.exp) {
        return res.status(401).json({ message: "Session expired! Please login again." });
      }
    } else {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      decoded = ticket.getPayload();
    }

    const user = await User.findById(decoded.sub || decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
