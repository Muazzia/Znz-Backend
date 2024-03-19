const { validateCreateCourse } = require('../../joiSchemas/Course/course');
const courseModel = require('../../models/courseModel');
const userModel = require('../../models/userModel');
const { uploadToCloudinary } = require('../../utils/cloudinary/cloudinary');
const { responseObject } = require('../../utils/responseObject');


const userAtrributesObject = {
    include: [{ model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName'] }]
}

const getAllCourses = async (req, res) => {
    try {
        const course = await courseModel.findAll(userAtrributesObject);
        return res.send(responseObject('Successfull', 200, course))

    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}

const getASpecificCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseModel.findByPk(id, {
            ...userAtrributesObject
        });

        if (!course) return res.status(404).send(responseObject('Course Not Found', 404))

        // const data = await modifySinlge(course)
        return res.send(responseObject('Successful', 200, course))
    } catch (error) {
        return res.status(500).send(responseObject('Server Error', 500))
    }
}

const deleteASpecificCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseModel.findOne({
            where: {
                courseId: id,
            },
            ...userAtrributesObject

        });

        if (!course) return res.status(404).send(responseObject('Course Not Found', 404))

        await course.destroy()
        return res.send(responseObject("Deleted Successfully", 200, course))
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Server Error' })
    }
}

const createCourse = async (req, res) => {
    try {
        const { error, value } = validateCreateCourse(req.body)
        if (error) return res.status(400).send({ status: 400, message: error.message });

        const userEmail = req.userEmail

        const user = await userModel.findByPk(userEmail)
        if (!user) return res.status(404).send(responseObject('User not Found', 404))

        const imageUrls = [];
        if (req.files) {
            for (const file of req.files) {
                const cloudinaryResponse = await uploadToCloudinary(file);
                if (cloudinaryResponse.error) {
                    return res.status(500).json(responseObject("Internal server error during image upload", 500, "", cloudinaryResponse.error.message));
                }

                imageUrls.push(cloudinaryResponse.secure_url);
            }
        }

        let course = await courseModel.create({ ...value, authorEmail: userEmail, images: imageUrls });

        if (!course) return res.status(404).send(responseObject("Course not created", 404))
        course = await courseModel.findByPk(course.courseId, { ...userAtrributesObject })


        return res.send(responseObject("Course Created Successfully", 200, course))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}


module.exports = { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse }