require("dotenv").config();
const nodemailer = require("nodemailer");
const Queue = require("bull");

const newEmailQueue = new Queue("newEmail", {
  limiter: {
    max: 50,
    duration: 1000,
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user_email,
    pass: process.env.email_password,
  },
});

newEmailQueue.process(async (job) => {
  const { to, subject, text,html } = job.data;
  const mainOptions = {
    from: process.env.user_email,
    to,
    subject,
    text,
    html,
  };

  try {
    // Process the job (send email)
    await transporter.sendMail(mainOptions);
    console.log(`Email sent to ${to}`);
    // Close the transport connection after processing
    transporter.close();
  } catch (error) {
    console.error("Error processing email job:", error.message);
  }
});

// Handle completed jobs
newEmailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

// Handle errors
newEmailQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

// const cleanQueue = async ()=>{
//   await emailQueue.clean(0,'completed');
// }

// cleanQueue().then(()=>{
//   console.log("queue cleaned. ready to start fresh")
// })

module.exports = { newEmailQueue };