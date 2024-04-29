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


const routes = require('./routes');
app.use('/api', routes)


// server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running at http://localhost:${PORT}`);
});


module.exports = app;