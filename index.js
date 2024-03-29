// imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for views in node project
app.set("view engine", "ejs");
app.use(express.static("public"));


// database connection called here
require("./database/connection");
// associations
require("./association/association");
// passport file for google oauth
require("./utils/passport/passport");
// cron job to delete stories
require('./utils/cronjob/cronjob')


// routes import
const authR = require("./routes/Auth/auth");
const adminR = require('./routes/Admin/admin')
const userR = require("./routes/User/userRoutes");
const storyR = require('./routes/Story/story')
const postR = require("./routes/Post/postRoutes");
const likeR = require("./routes/Like/likeRoutes");
const postCommentR = require('./routes/PostComment/postComment')
const tokenR = require('./routes/Token/token')
const coursesR = require('./routes/Course/course')
const followerR = require('./routes/Follower/follower')

const { checkJWT, adminCheckJWT } = require("./middleware/authenticationMiddleware");
const checkExistingToken = require("./middleware/previousToken");

//  middlewares
app.use('/api/validatetoken', checkExistingToken, checkJWT, tokenR)
app.use("/api/auth/user", authR);
app.use('/api/admin', adminCheckJWT, adminR)
app.use("/api/user", userR);

app.use("/api/user/story", checkExistingToken, checkJWT, storyR);

app.use("/api/user/post", checkExistingToken, checkJWT, postR);
app.use("/api/user/post/like", checkExistingToken, checkJWT, likeR);
app.use('/api/user/post/comment', checkExistingToken, checkJWT, postCommentR)
app.use('/api/user/connection', checkExistingToken, checkJWT, followerR)

app.use('/api/course', checkExistingToken, checkJWT, coursesR)



// server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
