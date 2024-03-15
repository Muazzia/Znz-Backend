const { validateCreateCourse } = require('../../joiSchemas/Course/course');
const courseModel = require('../../models/courseModel');
const userModel = require('../../models/userModel');
const { uploadToCloudinary } = require('../../utils/cloudinary/cloudinary');
const { responseObject } = require('../../utils/responseObject');


const modifyArray = async (courses) => {
    try {
        const arr = await Promise.all(
            courses.map(async (course, i) => {
                try {
                    const user = await userModel.findByPk(course.authorEmail)
                    if (!user) return null; // Return null if user not found
                    const { firstName, lastName, email, profilePic, coverPic } = user

                    return {
                        ...course.dataValues,
                        images: JSON.parse(course.dataValues.images),
                        user: {
                            firstName,
                            lastName,
                            email,
                            profilePic,
                            coverPic
                        }
                    };
                } catch (error) {
                    console.error(error);
                    return null;
                }
            })
        );
        return arr.filter(Boolean); // Filter out null values
    } catch (error) {
        console.error(error);
        return [];
    }
}

const modifySinlge = async (course) => {
    try {
        const user = await userModel.findByPk(course.authorEmail)
        if (!user) return {}

        const { firstName, lastName, coverPic, profilePic, email } = user
        return {
            ...course.dataValues,
            user: {
                firstName,
                lastName,
                coverPic,
                profilePic,
                email
            }
        }
    } catch (error) {
        console.log(error);
        return {}
    }

}

const getAllCourses = async (req, res) => {
    try {
        const course = await courseModel.findAll();

        const data = await modifyArray(course)
        console.log(data);
        return res.send(responseObject('Successfull', 200, data))

    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}

const getASpecificCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseModel.findByPk(id)

        if (!course) return res.status(404).send(responseObject('Course Not Found', 404))

        const data = await modifySinlge(course)
        return res.send(responseObject('Successful', 200, data))
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
            }
        });

        if (!course) return res.status(404).send(responseObject('Course Not Found', 404))

        const data = await modifySinlge(course)
        await course.destroy()
        return res.send(responseObject("Deleted Successfully", 200, data))
    } catch (error) {
        return res.status(500).send({ message: 'Server Error' })
    }
}

const createCourse = async (req, res) => {
    try {
        const { error, value } = validateCreateCourse(req.body)
        if (error) return res.status(400).send({ status: 400, message: error.message });

        const userEmail = req.userEmail

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

        const course = await courseModel.create({ ...value, authorEmail: userEmail, images: imageUrls })

        if (!course) return res.status(404).send(responseObject("Course not created", 404))

        const data = await modifySinlge(course)
        return res.send(responseObject("Course Created Successfully", 200, data))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}


module.exports = { getAllCourses, getASpecificCourse, deleteASpecificCourse, createCourse }