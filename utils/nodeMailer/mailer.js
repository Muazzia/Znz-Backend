require("dotenv").config();
const nodemailer = require("nodemailer");
const Queue = require("bull");


const newEmailQueue = new Queue("newEmail", "redis:127.0.0.1:6379");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user_email,
    pass: process.env.email_password,
  },
});


const handleRegUser = async (jwtToken, email) => {
  const resetContent = `
  <html>
    <head>
      <title>Verify Email</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>To reset the password, click on the link below:</p>
        <a href=${process.env.verifyUserLink}?jwt=${jwtToken} target="_blank" style="text-decoration: none;">
          <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Verify User Email
          </button>
        </a>
      </div>
    </body>
  </html>
`;



  await transporter.sendMail({
    to: email,
    subject: "User Validation",
    text: "Hello znz family, This email is to verify the gmail",
    html: resetContent,
  })
}

module.exports = { newEmailQueue, transporter, handleRegUser };