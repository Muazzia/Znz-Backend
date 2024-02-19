const express = require('express')
const { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse } = require('../../controller/Course/course')
const { handleCourseUpload } = require('../../middleware/multer')

const courseRouter = express.Router()

courseRouter.get('/', getAllCourses)
courseRouter.get('/:id', getASpecificCourse)
courseRouter.delete('/:id', deleteASpecificCourse)
courseRouter.post('/', handleCourseUpload, createCourse)

// courseRouter.put('/:id')

module.exports = courseRouter