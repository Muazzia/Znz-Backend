// imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const { rateLimit } = require("express-rate-limit")


const app = express();

app.use(cors());
app.use(helmet())
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


const routes = require('./routes');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})

app.use(limiter)
app.use('/api', routes)


// server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running at http://localhost:${PORT}`);
});


module.exports = app;