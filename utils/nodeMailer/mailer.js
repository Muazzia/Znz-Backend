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

const getContent = (title, heading, paragraph, buttonText, url, jwtToken) => {
  const resetContent = `
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">${heading}</h2>
        <p>${paragraph}, click on the link below:</p>
        <a href=${url}?jwt=${jwtToken} target="_blank" style="text-decoration: none;">
          <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            ${buttonText}
          </button>
        </a>
      </div>
    </body>
  </html>
`;
  return resetContent;
}


const handleRegUser = async (jwtToken, email) => {

  const content = getContent("Verify Email", "Email Verification", "To Verify Email", "Verify User Email", process.env.verifyUserLink, jwtToken);


  await transporter.sendMail({
    to: email,
    subject: "User Validation",
    text: "Hello znz family, This email is to verify the gmail",
    html: content,
  })
}

const handleResetPassword = async (jwtToken, email) => {

  const content = getContent("Reset Password", "Reset Password", "To reset the password", "Reset Password", process.env.emailFrontEndLink, jwtToken)

  await transporter.sendMail({
    to: email,
    subject: "Password Reset Email",
    text: "Hello znz family, you have generated the request for the reset email password",
    html: content,
  })
}

module.exports = { newEmailQueue, transporter, handleRegUser, handleResetPassword };