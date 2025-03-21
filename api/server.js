require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const teamRoutes = require("./routes/teamRoutes");
const inviteRoute = require("./routes/inviteRoute");
const verifyInvitationRoutes = require("./routes/invitationRoutes");

const app = express();
const PORT = process.env.PORT;

const upload = multer();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invite", inviteRoute);
app.use("/api/verify-invitation", verifyInvitationRoutes);

app.use("/", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
