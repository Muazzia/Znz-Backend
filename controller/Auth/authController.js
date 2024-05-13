const userModel = require("../../models/userModel");
const { Op } = require('sequelize')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegister, validateLogin, validateGoogleLogin } = require("../../joiSchemas/Auth/auth");
const { handleRegUser } = require("../../utils/nodeMailer/mailer");
const { responseObject } = require("../../utils/responseObject");



const registerUser = async (req, res) => {
  const { error, value } = validateRegister(req.body)
  if (error) return res.status(400).send(error.message)

  try {
    const { password } = value

    const hashedPassword = await bcrypt.hash(password, 10);


    const chkOldUser = await userModel.findOne({
      where: {
        [Op.or]: [
          { email: value.email },
        ]
      }
    });


    if (chkOldUser) {
      if (chkOldUser.email === value.email) {
        return res.status(400).send({
          statusCode: 400,
          message: "User with this email already exists",
        });
      } else if (chkOldUser.firstName === value.firstName) {
        return res.status(400).send({
          statusCode: 400,
          message: "User with this Name is already registered",
        });
      }
    }


    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });

    const jwtToken = jwt.sign(
      {
        userID: newUser.userID,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );

    await handleRegUser(jwtToken, newUser.email)

    return res.status(201).json({
      statusCode: 201,
      message: "user created successfully",
      user: newUser,
      token: jwtToken
    });
  } catch (error) {
    console.log("internal server error- registerUser", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const registerSuperAdmin = async (req, res) => {
  try {
    const { error, value } = validateRegister(req.body)
    if (error) return res.status(400).send(error.message)


    const { password } = value

    const hashedPassword = await bcrypt.hash(password, 10);

    const chkOldUser = await userModel.findByPk(value.email)

    if (chkOldUser) return res.status(400).send({
      statusCode: 400,
      message: "User Already Exist",
    })


    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
      role: "admin"
    });

    const jwtToken = jwt.sign(
      {
        userID: newUser.userID,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );

    await handleRegUser(jwtToken, newUser.email)

    return res.status(201).json({
      statusCode: 201,
      message: "Super-admin created successfully",
      user: newUser,
      token: jwtToken
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error", status: 500 })
  }
}

const verifyEmail = async (req, res) => {
  try {
    // throw new Error('Server')
    const accessToken = req.query.jwt;
    let userEmail;

    jwt.verify(accessToken, process.env.Secret_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).render('registerEmail', { apiResponseCode: 401 });
      } else {
        console.log("JWT decoded:", decoded);
        (async () => {
          userEmail = decoded.email;
          const user = await userModel.findByPk(userEmail)
          if (!user) return res.status(404).send({ status: 404, message: 'Not Found' })

          await user.update({
            isEmailVerified: true
          })

          return res.status(200).render('registerEmail', { apiResponseCode: 200 })
        })()
      }
    });
  } catch (error) {
    return res.status(500).render('registerEmail', { apiResponseCode: 500 })
    // return res.status(500).send('Server Error')
  }
}

const resendEmail = async (req, res) => {
  try {
    const accessToken = req.query.jwtToken;

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(accessToken, process.env.Secret_KEY, { ignoreExpiration: true }, (err, decoded) => {
        console.log(decoded);
        if (err) {
          // Handle the error, if needed
          console.error(err);
          resolve(null);
        } else {
          resolve(decoded);
        }
      });
    });

    // If token is not valid, reject the request with a 401 response
    if (!decoded) {
      return res.status(401).send('Invalid Token');
    }

    // Proceed with the rest of the code after decoding the JWT
    const userEmail = decoded.email;

    const user = await userModel.findByPk(userEmail);
    if (!user) return res.status(404).send('User not Found');

    const jwtToken = jwt.sign(
      {
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );

    await handleRegUser(jwtToken, user.email);

    return res.status(200).send({ message: "Email Send Successfully" });
  } catch (error) {
    return res.status(500).send('Server Error');
  }
};


const loginUser = async (req, res) => {
  const { error, value } = validateLogin(req.body)
  if (error) return res.status(400).send(error.message)

  try {
    const { email, password } = value
    const userToFind = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!userToFind) {
      return res.status(400).json({
        statusCode: 400,
        message: "invalid email or password",
        error: "invalid email or password",
      });
    }

    if (!userToFind.isEmailVerified) return res.status(401).send(responseObject("Unauthorized: Email not Verified", 401, "", "Unauthorized: Email not Verified"))
    if (userToFind.isBlock) return res.status(401).send(responseObject("User is Blocked", 401, "", "User is Blocked Can't Access"))


    if (userToFind.googleUser || userToFind.length === 0) return res.status(400).send(responseObject('Cant Login using Email and password', 400, "", "Google User"))
    // comparing the hashed password with the user's password in the req.body
    const validatePassword = await bcrypt.compare(
      password,
      userToFind.password
    );
    // if error in the password
    if (!validatePassword) {
      return res.status(400).json({
        statusCode: 400,
        message: "invalid email or password",
        error: "invalid email or password",
      });
    }

    const jwtToken = jwt.sign(
      {
        userID: userToFind.userID,
        firstName: userToFind.firstName,
        lastName: userToFind.lastName,
        email: userToFind.email,
        role: userToFind.role,
        isEmailVerified: userToFind.isEmailVerified
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );

    return res
      .status(201)
      .json({
        statusCode: 201,
        message: "user successfully login",
        user: userToFind,
        token: jwtToken,
      });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "internal server error",
      error: error,
    });
  }
};

const googleLoginController = async (req, res) => {
  try {
    const { error, value: { accessToken } } = validateGoogleLogin(req.body);
    if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

    // let response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    // const data = await res.json();

    // if (response.status !== 200) {
    //   console.log("in if 1");
    //   console.error('Error verifying access token:', data.error_description);
    //   return res.status(400).send(responseObject("Invalid Access Token", 400, "Invalid access token"));
    // }


    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (googleResponse.status !== 200) return res.status(400).send("Try Again.", 400, "Error fetching user Data")
    const userData = await googleResponse.json()

    const { given_name, family_name, picture, email } = userData

    let user = await userModel.findByPk(email);

    if (!user) {
      user = await userModel.create({
        firstName: given_name,
        lastName: family_name,
        profilePic: picture,
        email,
        googleUser: true,
        isEmailVerified: true,
        role: 'user'
      })
    }

    const jwtToken = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      process.env.Secret_KEY,
      { expiresIn: process.env.expiry_time }
    );



    return res.status(200).send(responseObject("Login Successful", 200, { user, token: jwtToken }));
  } catch (error) {
    return res.status(500).send(responseObject("Internal Server Error", 500, "Server Error"))
  }
}




module.exports = { googleLoginController, registerUser, registerSuperAdmin, loginUser, verifyEmail, resendEmail };
