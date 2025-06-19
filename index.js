// index.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let generatedOTP = null;

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  // Generate 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // Nodemailer setup (replace below with your Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tandonnakul987@gmail.com",     // 👈 apna Gmail daalo
      pass: "riizonmozxvcrzht",       // 👈 Gmail ka App Password daalo
    },
  });

  const mailOptions = {
    from: "tandonnakul987@gmail.com",
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${generatedOTP}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed to send" });
  }
});

// ✅ Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (otp === generatedOTP) {
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
