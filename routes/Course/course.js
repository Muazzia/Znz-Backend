const express = require('express')
const { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse, updateCourse, getMyCourses } = require('../../controller/Course/course')
const { handleMulterUpload } = require('../../middleware/multer')

const courseRouter = express.Router()

courseRouter.get('/', getAllCourses)
courseRouter.get('/my-courses', getMyCourses)
courseRouter.get('/:id', getASpecificCourse)
courseRouter.delete('/:id', deleteASpecificCourse)

courseRouter.post('/', handleMulterUpload("images[]", false, 10), createCourse)

// this need to be change
// courseRouter.put('/:id', handleCourseUpload, updateCourse)


module.exports = courseRouter