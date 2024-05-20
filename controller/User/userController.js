const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("../../models/userModel");
const tokenModel = require("../../models/blacklistModel");
const { transporter, handleResetPassword } = require("../../utils/nodeMailer/mailer");
const additional = require("../../models/userAdditionalInformation");
const { validateForgotPass, validateSetPass, validateAdditionalUserData, validateChangePassword, validateUserData, validateUserPersonalInfoUpdate, validaUpdateAdditionalUserData } = require("../../joiSchemas/User/userSchema");
const { uploadSingleToCloudinary } = require("../../utils/cloudinary/cloudinary");
const userDetailsModel = require("../../models/userAdditionalInformation");
const { responseObject } = require("../../utils/responseObject");


const passwordExludeObj = {
  attributes: {
    exclude: ['password']
  }
}

// new
const getUserData = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userModel.findByPk(email, {
      ...passwordExludeObj
    });

    if (!user) return res.status(404).send('Not Found');

    return res.send({ message: "Data Received Successfully", status: "200", user })


  } catch (error) {
    return res.status(500).send('Server Error')
  }
}


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

    if (userToFind.googleUser) return res.status(400).send({ statusCode: 400, message: "Google User Can't Reset Password" })

    if (userToFind.password === null) {
      return res.status(400).json({ statusCode: 400, message: "Email sent already." });
    }

    const jwtToken = jwt.sign(
      {
        email: userToFind.email,
        isPassReset: true
      },
      process.env.Secret_KEY,
      { expiresIn: '20m' }
    );

    await handleResetPassword(jwtToken, userToFind.email)

    // Send a success response to the client
    return res.status(201).json({ statusCode: 201, message: "Reset Link Sent. Check your email." });

  } catch (error) {
    console.error("Error processing forgotPassword:", error);
    // Send an error response to the client
    return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};


const setPassword = async (req, res) => {
  if (!req.isPassReset) return res.status(401).send('Token Invalid')

  const { error, value: { password, confirmPassword } } = validateSetPass(req.body)
  if (error) return res.status(400).send(error.message)


  // const email = req.params.email;
  const email = req.userEmail
  const userPassword = await userModel.findOne({
    where: { email: email }, attributes: {
      exclude: ['password']
    }
  });
  if (!userPassword) {
    return res.status(400).json({ statusCode: 400, message: "user not found" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "The password and confirm password do not match",
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
      message: "Password updated successfully",
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


const updateAdditionalUserDetails = async (req, res) => {
  try {
    const { error, value } = validaUpdateAdditionalUserData(req.body)
    console.log(value, "value",);

    if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

    if (Object.keys(value).length === 0) return res.status(400).send(responseObject("Please add atleast one value", 400, "", "update request is invalid"))

    const userDetails = await userDetailsModel.findByPk(req.userEmail, {
      ...passwordExludeObj
    })
    if (!userDetails) return res.status(404).send(responseObject("User not found", 404, "", "Id in not valid"))


    await userDetails.update({
      ...value
    });
    return res.status(200).send(responseObject("Details Updated Successfully", 200, userDetails))
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
  }
}


const addProfilePic = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.userEmail, {
      ...passwordExludeObj
    })
    if (!user) return res.status(400).send('user not found')


    const cloudinaryResponse = await uploadSingleToCloudinary(req.file, 'user')

    if (!cloudinaryResponse.isSuccess) {
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error during image upload",
        error: cloudinaryResponse.error,
      });
    }

    await user.update({
      profilePic: cloudinaryResponse.data
    })

    return res.status(201).send({ message: "Profile Pic Updated Successfully", user })
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
}

const addCoverPic = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.userEmail, {
      ...passwordExludeObj
    })
    if (!user) return res.status(400).send('user not found')

    const cloudinaryResponse = await uploadSingleToCloudinary(req.file, 'user');
    if (cloudinaryResponse.error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error during image upload",
        error: cloudinaryResponse.error.message,
      });
    }

    await user.update({
      coverPic: cloudinaryResponse.secure_url
    })


    return res.status(201).send({ message: "Cover Photo Updated Successfully", user })
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
}

const getUserExtraDetails = async (req, res) => {
  try {
    const userDetails = await userDetailsModel.findByPk(req.userEmail, {
      ...passwordExludeObj
    })
    if (!userDetails) return res.send({})
    return res.send({ message: "User Extra Details", userDetails })
  } catch (error) {
    return res.status(500).send('Server error')
  }
}


const changePassword = async (req, res) => {
  try {
    const { error, value } = validateChangePassword(req.body)
    if (error) return res.status(400).send(error.message)

    const { oldPassword, newPassword, confirmPassword } = value
    if (newPassword !== confirmPassword) return res.status(400).send('passwords doesnt match')

    const user = await userModel.findByPk(req.userEmail)
    if (!user) return res.status(404).send("User not found")

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    await user.update({ password: hashedNewPassword });

    return res.status(200).json({ message: 'Password changed successfully', user });
  }
  catch (error) {
    console.log(error);
    return res.status(500).send('Server error')
  }
}

const addUserDetails = async (req, res) => {
  try {
    const { error, value } = validateUserData(req.body)
    if (error) return res.status(400).send(error.message)

    const user = await userModel.findByPk(req.userEmail, {
      ...passwordExludeObj
    });

    if (!user) return res.status(404).send('Not found User')

    await user.update({
      ...value
    })

    return res.status(200).send({ message: "Deatils Updated Successfully", user })
  } catch (error) {
    return res.status(500).send("Server Error")
  }
}

const updateUserPersonalInfo = async (req, res) => {
  try {
    const { error, value } = validateUserPersonalInfoUpdate(req.body)
    if (error) return res.status(400).send(error.message);

    const userEmail = req.userEmail

    const user = await userModel.findByPk(userEmail, {
      ...passwordExludeObj
    })
    if (!user) return res.status(404).send('User Not Found')

    await user.update({
      ...value
    })

    return res.status(200).send({
      message: "Updated",
      user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error')
  }
}

module.exports = {
  forgotPassword,
  setPassword,
  userDashboard,
  logout,
  additionalUserDetails,
  updateAdditionalUserDetails,
  addProfilePic,
  addCoverPic,
  getUserExtraDetails,
  changePassword,
  addUserDetails,
  updateUserPersonalInfo,
  getUserData
};
