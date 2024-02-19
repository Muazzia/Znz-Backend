const { validateCreateCourse } = require('../../joiSchemas/Course/course');
const courseModel = require('../../models/courseModel')
const { uploadToCloudinary } = require('../../utils/cloudinary/cloudinary')


const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.findAll({
            where: {
                isDeleted: false
            }
        });

        return res.send(courses)

    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const getASpecificCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseModel.findOne({
            where: {
                courseId: id,
                isDeleted: false
            }
        });

        if (!course) return res.status(404).send('Course not found')

        return res.send(course)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const deleteASpecificCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseModel.findOne({
            where: {
                courseId: id,
                isDeleted: false
            }
        });

        if (!course) return res.status(404).send('Course not found')

        await course.update({
            isDeleted: true
        })
        return res.send({ message: "Deleted Successfully", course })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const createCourse = async (req, res) => {
    try {
        const { error, value } = validateCreateCourse(req.body)
        if (error) return res.status(400).send(error.message);

        const userEmail = req.userEmail

        const imageUrls = [];
        if (req.files) {
            for (const file of req.files) {
                const cloudinaryResponse = await uploadToCloudinary(file);
                if (cloudinaryResponse.error) {
                    return res.status(500).json({
                        statusCode: 500,
                        message: "Internal server error during image upload",
                        error: cloudinaryResponse.error.message,
                    });
                }

                imageUrls.push(cloudinaryResponse.secure_url);
            }
        }

        const course = await courseModel.create({ ...value, authorEmail: userEmail, images: imageUrls })

        if (!course) return res.status(404).send('Course not created')
        return res.send(course)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error')
    }
}


module.exports = { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse }