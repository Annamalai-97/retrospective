const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index")
const userdb = db.user

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleSignup = async (req, res) => {
  try {
    console.log("Google Signup API hit");
    
    const { token } = req.body;
    if (!token) {
      console.log(" No token received");
      return res.status(400).json({ message: "Google token is required." });
    }

    console.log("Token received:", token.substring(0, 20), "..."); 

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    console.log(" Token Verified Successfully");

    const { name, email, picture, sub, iss, aud, exp } = ticket.getPayload();

    if (iss !== "https://accounts.google.com") {
      return res.status(401).json({ message: "Invalid token issuer" });
    }
    if (aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Token audience mismatch" });
    }
    if (Date.now() / 1000 > exp) {
      return res.status(401).json({ message: "Token expired" });
    }

    console.log(" User Info:", { name, email, picture , sub});

    let user = await userdb.findOne({ email });

    if (!user) {
      console.log(" Creating new user:", email); 
      user = new userdb({
        name,
        email,
        googleId: sub,
        password:null,
        role: "User",
        profileImage: picture,
        provider: "google",
      });
         
      await user.save();
      console.log("New user saved successfully");
    } else {
      console.log(" User already exists:", user.email);
    }

    const authToken = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("JWT Token Generated");

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    console.log("Token set in cookie");
    
    return res.status(200).json({
      message: "Google Sign-In successful!",
      token: authToken,
      username: user.name,
      profileImage: user.profileImage,
    });

  } catch (error) {
    console.error("❌ Google Sign-Up error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let user = await userdb.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new userdb({
      name,
      email,
      password: hashedPassword,
      role: role || "User",

    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userdb.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      username: user.name 
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access! Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired! Please login again." });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful!" });
};
