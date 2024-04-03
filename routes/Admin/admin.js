const express = require('express')
const { getAllUser, updateUser, getAllCourses, deleteCourse, getAllProducts } = require('../../controller/Admin/admin')
const adminRouter = express.Router()


// User routes
adminRouter.get("/user", getAllUser)
adminRouter.put('/user', updateUser)

// Course Routes
adminRouter.get('/course', getAllCourses)
adminRouter.delete('/course/:id', deleteCourse)


// Products Routes
adminRouter.get('/product/:userEmail', getAllProducts)

adminRouter.delete('/post/:postId')
adminRouter.delete('/user/:userEmail')
adminRouter.delete('/course/:courseId')
// ad

module.exports = adminRouter
