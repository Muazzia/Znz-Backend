const express = require("express")
const courseRouter = express.Router();
const { getAllCourses, getAllCoursesOfASpecificUser, deleteCourse, getAllParentCat, getAllSubCat, getAParentCat, createParentCat, createSubCat, deleteParentCat, deleteSubCat } = require('../../../controller/Admin/course')





courseRouter.post('/parent', createParentCat)
courseRouter.post('/sub', createSubCat)

courseRouter.delete('/parent/:id', deleteParentCat)
courseRouter.delete('/sub/:id', deleteSubCat)

courseRouter.put('/parent/:id')
courseRouter.put('/sub/:id')


courseRouter.get('/', getAllCourses)
courseRouter.get('/:userEmail', getAllCoursesOfASpecificUser)
courseRouter.delete('/:id', deleteCourse)


module.exports = courseRouter