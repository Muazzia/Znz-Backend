const express = require('express')
const { getAllUser, updateUser, getAllCourses, deleteCourse, getAllProducts, getAllProductsForASpecificUser, deleteAProduct, getAllCoursesOfASpecificUser } = require('../../controller/Admin/admin')
const adminRouter = express.Router()


// User routes
adminRouter.get("/user", getAllUser)
adminRouter.put('/user', updateUser)

// Course Routes
adminRouter.get('/course', getAllCourses)
adminRouter.get('/course/:userEmail', getAllCoursesOfASpecificUser)
adminRouter.delete('/course/:id', deleteCourse)


// Products Routes
adminRouter.get('/product', getAllProducts)
adminRouter.get('/product/:userEmail', getAllProductsForASpecificUser)
adminRouter.delete('/product/:id', deleteAProduct)


adminRouter.delete('/post/:postId')
adminRouter.delete('/user/:userEmail')
adminRouter.delete('/course/:courseId')
// ad

module.exports = adminRouter
