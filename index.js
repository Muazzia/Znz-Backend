// imports
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// env file
require("dotenv").config();
const PORT = process.env.PORT;

// database connection called here
require("./database/connection");
// associations
require("./association/association");
// passport file for google oauth
require("./utils/passport/passport");

// routes import
const authR = require("./routes/Auth/auth");
const userR = require("./routes/User/userRoutes");
const postR = require("./routes/Post/postRoutes");
const likeR = require("./routes/Like/likeRoutes");
//  middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/user", authR);
app.use("/api/user", userR);
app.use("/api/user", postR);
app.use("/api/post", likeR);
// for views in node project
app.set("view engine", "ejs");
app.use(express.static("public"));

// server

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
