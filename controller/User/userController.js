const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("../../models/userModel");
const tokenModel = require("../../models/blacklistModel");
const { newEmailQueue, transporter } = require("../../utils/nodeMailer/mailer");
const additional = require("../../models/userAdditionalInformation");
const { validateForgotPass, validateSetPass, validateAdditionalUserData } = require("../../joiSchemas/User/userSchema");

// new
const forgotPassword = async (req, res) => {
  const { error, value: { email } } = validateForgotPass(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const userToFind = await userModel.findOne({ where: { email: email } });

    if (!userToFind) {
      return res.status(400).json({ statusCode: 400, message: "User not found" });
    }

    if (userToFind.password === null) {
      return res.status(400).json({ statusCode: 400, message: "Email sent already." });
    }

    const jwtToken = jwt.sign(
      {
        userID: userToFind.userID,
        firstName: userToFind.firstName,
        lastName: userToFind.lastName,
        email: userToFind.email,
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );

    const resetContent = `
      <html>
        <head>
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
          <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>To reset the password, click on the link below:</p>
            <a href=${process.env.emailFrontEndLink}?jwt=${jwtToken} target="_blank" style="text-decoration: none;">
              <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                Reset Password
              </button>
            </a>
          </div>
        </body>
      </html>
    `;


    await transporter.sendMail({
      to: userToFind.email,
      subject: "Password Reset Email",
      text: "Hello znz family, you have generated the request for the reset email password",
      html: resetContent,
    })

    // Send a success response to the client
    return res.status(201).json({ statusCode: 201, message: "Password reset. Check your email." });

  } catch (error) {
    console.error("Error processing forgotPassword:", error);
    // Send an error response to the client
    return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};





// old
// const forgotPassword = async (req, res) => {
//   console.log('asdf');
//   // res.end("hello from user controller")
//   const { error, value: { email } } = validateForgotPass(req.body)
//   if (error) return res.status(400).send(error.message)

//   try {
//     const userToFind = await userModel.findOne({ where: { email: email } });
//     if (!userToFind) {
//       return res
//         .status(400)
//         .json({ statusCode: 400, message: "user not found" });
//     }
//     if (userToFind.password === null) {
//       return res
//         .status(400)
//         .json({ statusCode: 400, message: "email sent already. " });
//     }
//     // await userToFind.update({ password: null });
//     const resetContent = `
//     <html>
//       <head>
//         <title>Reset Password</title>
//       </head>
//       <body style="font-family: Arial, sans-serif;">

//         <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>To Reset the Password, click on the link below:</p>
//           <a href="http://localhost:3000/api/user/set-password/${email}" target="_blank" style="text-decoration: none;">
//             <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
//               Reset Password
//             </button>
//           </>
//         </div>
//       </body>
//     </html>
//   `;
//     await newEmailQueue.add({
//       to: userToFind.email,
//       subject: "Password Reset Email",
//       text: "Hello znz family, you have generated the request for the reset email password",
//       html: resetContent,
//     });
//     return res
//       .status(201)
//       .json({ statusCode: 201, message: "password reset. check your email" });
//   } catch (error) {
//     console.log("error=>", error);
//   }
// };

const setPassword = async (req, res) => {
  // res.end("hello from setPassword");
  const { error, value: { password, confirmPassword } } = validateSetPass(req.body)
  if (error) return res.status(400).send(error.message)

  const email = req.params.email;
  const userPassword = await userModel.findOne({ where: { email: email } });
  if (!userPassword) {
    return res.status(400).json({ statusCode: 400, message: "user not found" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "password and confirm password doesnot matches",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userPassword.update(
      { password: hashedPassword },
      { where: { email: email } }
    );
    return res.status(201).json({
      statusCode: 201,
      message: "password changed",
      user: userPassword,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "internal server error",
      error: error,
    });
  }
};
const userDashboard = (req, res) => {
  res.end("hello user dashboard");
};

const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    // console.log(token)
    await tokenModel.create({ token });
    res.status(200).json({
      message: "user logout successfully!",
      additionalMessage: "this session token destroyed",
    });
  } catch (error) {
    console.error("error=>", error);
    res.status(500).json({ message: "internal server error", error: error });
  }
};

const additionalUserDetails = async (req, res) => {
  try {
    const { error, value: { country, language, gender, interests } } = validateAdditionalUserData(req.body)
    if (error) return res.status(400).send(error.message)

    // Check if all fields are provided
    if (!country || !language || !gender || !interests) {
      return res.status(400).json({
        statusCode: 400,
        message: "All fields required",
        fields: "country, gender, language, interests",
      });
    }

    // Check for the presence of the JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ statusCode: 401, message: "Token missing" });
    }

    // Split the token on the base of space
    const accessToken = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(accessToken, process.env.Secret_KEY);

    // Extract user email from decoded information
    const userEmail = decoded.email;

    // Check if information is already added
    const checkInformation = await additional.findOne({ where: { email: userEmail } });
    if (checkInformation) {
      return res.status(400).json({ statusCode: 400, message: "Information already added" });
    }

    // Add additional details
    const additionalDetails = await additional.create({
      email: userEmail,
      country: country,
      gender: gender,
      language: language,
      interests: interests,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Additional details added successfully",
      information: additionalDetails,
    });
  } catch (error) {
    console.error("Error in additionalUserDetailsController", error);
    return res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}


module.exports = {
  forgotPassword,
  setPassword,
  userDashboard,
  logout,
  additionalUserDetails,
};
