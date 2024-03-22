const express = require('express')
const { getAllUser, updateUser } = require('../../controller/Admin/admin')
const adminRouter = express.Router()

// get
adminRouter.get("/user", getAllUser)

// update Blocked UnBlocked Status
adminRouter.put('/user', updateUser)



adminRouter.delete('/post/:postId')
adminRouter.delete('/user/:userEmail')
adminRouter.delete('/course/:courseId')
// ad

module.exports = adminRouter
