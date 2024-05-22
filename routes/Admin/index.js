const express = require('express')
const adminMainRouter = express.Router();

const course = require('./course')
const product = require('./product')
const user = require('./user')



adminMainRouter.use("/course", course);
adminMainRouter.use("/product", product)
adminMainRouter.use("/user", user)


module.exports = adminMainRouter