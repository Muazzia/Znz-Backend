const userModel = require("../../models/userModel");
const { Op } = require('sequelize')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegister, validateLogin, validateGoogleLogin } = require("../../joiSchemas/Auth/auth");
const { handleRegUser } = require("../../utils/nodeMailer/mailer");
const { responseObject } = require("../../utils/responseObject");


const registerUser = async (req, res) => {
  const { error, value } = validateRegister(req.body)
  if (error) return res.status(400).send(responseObject(error.message, 400,"",error.message))
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
        return res.status(400).send(responseObject("User with this email already exists", 400,"","User with this email already exists"))
      } else if (chkOldUser.firstName === value.firstName) {
        return res.status(400).send(responseObject("User with this email already exists", 400,"","User with this email already exists"))
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
    const data ={user: newUser,token: jwtToken
    }
    return res.status(201).send(responseObject("Verification email has been sent to the user", 201,data))
  } catch (error) {
    return res.status(500).send(responseObject("Internal Server Error", 500,"",error))  }
};

const registerSuperAdmin = async (req, res) => {
  try {
    const { error, value } = validateRegister(req.body)
    if (error)   return res.status(400).send(responseObject(error.message, 400,"",error.message))
    const { password } = value
    const hashedPassword = await bcrypt.hash(password, 10);
    const chkOldUser = await userModel.findByPk(value.email)
    if (chkOldUser)   return res.status(400).send(responseObject("User Already Exist", 400,"","User Already Exist"))
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
    const data ={user: newUser,token: jwtToken}

    return res.status(201).send(responseObject("Super-admin created successfully", 201,data))
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject("Server Error", 500,"","Server Error"))
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

          if (!user) res.status(404).send(responseObject("Not Found", 404,"","Not Found"))
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

      return res.status(401).send(responseObject("Invalid Token", 401,"","Invalid Token"))
    }
    // Proceed with the rest of the code after decoding the JWT
    const userEmail = decoded.email;
    const user = await userModel.findByPk(userEmail);
    if (!user) return  res.status(404).send(responseObject("User not Found", 404,"","User not Found"))
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
    return res.status(200).send(responseObject("Email Send Successfully", 200,"","Email Send Successfully"))
  } catch (error) {
    return res.status(500).send(responseObject("Server Error", 500,"","Server Error"))
  }
};

const loginUser = async (req, res) => {
  const { error, value } = validateLogin(req.body)
  if (error) return res.status(400).send(responseObject(error.message, 400,"",error.message))
  try {
    const { email, password } = value
    const userToFind = await userModel.findOne({
      where: {
        email: email,
      },
    });
    if (!userToFind) {
      return res.status(400).send(responseObject("invalid email or password", 400,"","invalid email or password"))
    }
    if (!userToFind.isEmailVerified) return res.status(401).send(responseObject("Unauthorized: Email not Verified", 401, "", "Unauthorized: Email not Verified"))
    if (userToFind.isBlock) return res.status(401).send(responseObject("User is Blocked", 401, "", "User is Blocked Can't Access"))
    if (userToFind.googleUser) return res.status(400).send(responseObject('Cant Login using Email and password', 400, "", "Google User"))
    // comparing the hashed password with the user's password in the req.body
    const validatePassword = await bcrypt.compare(
      password,
      userToFind.password
    );
    // if error in the password
    if (!validatePassword) {
      return res.status(400).send(responseObject("invalid email or password", 400,"","invalid email or password"))
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
    const data = { user: userToFind,token: jwtToken,}
    return res.status(201).send(responseObject("user successfully login", 201,data))
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(responseObject("internal server error", 500,"",error))
  }
};

const googleLoginController = async (req, res) => {
  try {
    const { error, value: { accessToken } } = validateGoogleLogin(req.body);
    if (error) res.status(400).send(responseObject(error.message, 400,"",error.message))
     
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
    if (googleResponse.status !== 200) return res.status(400).send(responseObject("Token is not valid", 400,"","Token is not valid"))
    const userData = await googleResponse.json()
    const { given_name, family_name, picture, email } = userData
    if (!email) return res.status(400).send(responseObject("Invalid Token", 400,"","Invalid Token"))
    let user = await userModel.findByPk(email, {
      attributes: {
        exclude: ["password"]
      }
    })
    if (user && !user.googleUser)  res.status(400).send(responseObject("User with Email Already Exist. Try loging with email & password", 400,"","User with Email Already Exist. Try loging with email & password"))
    if (!user) {
      user = await userModel.create({
        firstName: given_name,
        lastName: family_name || " ",
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
    const data ={user, token: jwtToken,}
    return res.status(200).send(responseObject("user successfully login", 200,data))
  } catch (error) {
    return res.status(500).send(responseObject("internal server error", 500,"","internal server error"))
  }
}


module.exports = { googleLoginController, registerUser, registerSuperAdmin, loginUser, verifyEmail, resendEmail };
