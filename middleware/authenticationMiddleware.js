const jwt = require("jsonwebtoken");
const { responseObject } = require("../utils/responseObject");
const userModel = require("../models/userModel");

function checkJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: Token not available" });
    }
    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.Secret_KEY, async (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      } else {
        console.log("JWT decoded:", decoded);
        req.isPassReset = decoded.isPassReset ? true : false
        req.userEmail = decoded.email;
        const user = await userModel.findByPk(req.userEmail);
        if (!user) return res.status(404).send(responseObject("User dosn't Exist", 404, "", "User not Found"))
        if (!req.isPassReset && !user.isEmailVerified) return res.status(401).json({ error: "Unauthorized: Email Not Verified" })
        if (user.isBlocked) return res.status(401).send(responseObject("Blocked Can't Access", 401, "", "User is Blocked"))
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

function adminCheckJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).send("Unauthorized: Token not available");
    const accessToken = authHeader.split(" ")[1];
    const userInfo = jwt.decode(accessToken);
    if (userInfo.role === "admin") {
      jwt.verify(accessToken, process.env.Secret_KEY, async (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
          return res.status(401).send("Unauthorized: Invalid token");
        } else {
          console.log("JWT decoded:", decoded);
          req.isPassReset = decoded.isPassReset ? true : false
          req.userEmail = decoded.email;
          const user = await userModel.findByPk(req.userEmail);
          if (!user) return res.status(404).send(responseObject("User dosn't Exist", 404, "", "User not Found"))
          if (!req.isPassReset && !user.isEmailVerified) return res.status(401).json({ error: "Unauthorized: Email Not Verified" })
          if (user.isBlocked) return res.status(401).send(responseObject("Blocked Can't Access", 401, "", "User is Blocked"))
          next();
        }
      });
    } else {
      res.status(403).send("Forbidden: You are not an admin");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { checkJWT, adminCheckJWT };
