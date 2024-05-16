const express = require("express")
const courseRouter = express.Router();
const { getAllCourses, getAllCoursesOfASpecificUser, deleteCourse } = require('../../../controller/Admin/course')


courseRouter.get('', getAllCourses)
courseRouter.get('/:userEmail', getAllCoursesOfASpecificUser)
courseRouter.delete('/:id', deleteCourse)

// course Cat Routes
courseRouter.get('/parent')
courseRouter.get('/sub')
courseRouter.get('/parent/:id')
courseRouter.get('/sub/:id')
courseRouter.post('/parent')
courseRouter.post('/sub')
courseRouter.delete('/parent/:id')
courseRouter.delete('/sub/:id')
courseRouter.put('/parent/:id')
courseRouter.put('/sub/:id')


module.exports = courseRouter