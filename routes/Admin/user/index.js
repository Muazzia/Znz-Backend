const express = require('express')
const userAdminRouter = express.Router()

const { getAllUser, updateUser } = require('../../../controller/Admin/user')

userAdminRouter.get("/", getAllUser)
userAdminRouter.put('/', updateUser)

module.exports = userAdminRouter