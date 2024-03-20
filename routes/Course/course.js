const express = require('express')
const { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse, updateCourse } = require('../../controller/Course/course')
const { handleCourseUpload, handleFileUpload } = require('../../middleware/multer')

const courseRouter = express.Router()

courseRouter.get('/', getAllCourses)
courseRouter.get('/:id', getASpecificCourse)
courseRouter.delete('/:id', deleteASpecificCourse)
courseRouter.post('/', handleCourseUpload, createCourse)
courseRouter.put('/:id', handleCourseUpload, updateCourse)


module.exports = courseRouter