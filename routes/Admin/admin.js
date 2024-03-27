const express = require('express')
const { getAllUser, updateUser, getAllCourses, deleteCourse } = require('../../controller/Admin/admin')
const adminRouter = express.Router()


// User routes
adminRouter.get("/user", getAllUser)
adminRouter.put('/user', updateUser)

// Course Routes
adminRouter.get('/course', getAllCourses)
adminRouter.delete('/course/:id', deleteCourse)


adminRouter.delete('/post/:postId')
adminRouter.delete('/user/:userEmail')
adminRouter.delete('/course/:courseId')
// ad

module.exports = adminRouter
