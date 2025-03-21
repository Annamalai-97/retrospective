const nodemailer = require("nodemailer");
const db = require("../models/index");
const boarddb = db.board;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const InvitaionModal = require("../models/InvitaionModal");

const sendInvitation = async (req, res) => {
  const { emails, boardId } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0 || !boardId) {
    return res.status(400).json({ message: "Email array and Board ID are required." });
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    return res.status(400).json({ message: "Invalid board ID format." });
  }

  try {
    const board = await boarddb.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    const boardLinkBase = `${process.env.FRONTEND_URL}/customZones?id=${encodeURIComponent(board.id)}&name=${encodeURIComponent(board.boardName.replace(/\s+/g, '-'))}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const email of emails) {
      const token = jwt.sign({ email, boardId }, process.env.JWT_SECRET, { expiresIn: "1h" });

      await InvitaionModal.create({
        email,
        boardId,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      const boardLink = `${boardLinkBase}&email=${encodeURIComponent(email)}`;

      let mailOptions = {
        from: `"Your Project" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Invitation to Join Board: ${board.boardName}`,
        html: `
   <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <p style="font-size: 16px;">Hi,</p>

  <p style="font-size: 16px;">
    You have been invited to collaborate on the board: 
    <strong style="color: #2b6cb0;">${board.boardName}</strong>.
  </p>

  <p style="font-size: 16px; margin: 30px 0;">
    <a href="${boardLink}" 
       style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
      Access Board
    </a>
  </p>

  <p style="font-size: 14px; color: #555;">
    Click the button above to access the board. Please note that this link is valid for <strong>1 hour</strong>.
  </p>

  <p style="font-size: 14px; color: #999; margin-top: 40px;">
    If you were not expecting this invitation, you can safely ignore this email.
  </p>
</div>

        `,
      };
      try {
        await transporter.sendMail(mailOptions);
        if (!board.members) {
          board.members = [];
        }
        if (!board.members.some(member => member.email === email)) {
          board.members.push({ email });
        }
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
      }
    }
    await board.save();
    res.status(200).json({ message: "Invitations sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send invitations." });
  }
};

module.exports = { sendInvitation };
