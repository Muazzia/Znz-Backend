const { validateCreateCourse, validateUpdateCourse } = require('../../joiSchemas/Course/course');
const courseModel = require('../../models/courseModel');
const userModel = require('../../models/userModel');
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../../utils/cloudinary/cloudinary');
const { responseObject } = require('../../utils/responseObject');
const { sortData } = require('../../utils/sortdata');


const userAtrributesObject = {
    include: [{ model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName', "bio"] }]
}

const getAllCourses = async (req, res) => {
    try {
        const course = await courseModel.findAll(userAtrributesObject);
        const data = sortData(course)
        return res.send(responseObject('Successfull', 200, data))

    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}

const getMyCourses = async (req, res) => {
    try {
        const userEmail = req.userEmail;
        const course = await courseModel.findAll({
            where: {
                authorEmail: userEmail
            },
            ...userAtrributesObject
        });
        const data = sortData(course)

        return res.status(200).send(responseObject("Successfully Reterived Data", 200, data))

    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
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
                authorEmail: req.userEmail
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


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing required parameter - images",
            });
        }

        const imagesUploadResponse = await uploadMultipleToCloudinary(req.files, "course")
        if (!imagesUploadResponse.isSuccess) return res.status(500).send(responseObject("Image Uplaod Error", 500, "", imagesUploadResponse.error));

        const imageUrls = imagesUploadResponse.data;


        let course = await courseModel.create({ ...value, authorEmail: userEmail, images: imageUrls });

        if (!course) return res.status(404).send(responseObject("Course not created", 404))
        course = await courseModel.findByPk(course.courseId, { ...userAtrributesObject })


        return res.send(responseObject("Course Created Successfully", 200, course))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}


// there are things need to change modify it again
const updateCourse = async (req, res) => {
    try {
        const { error, value } = validateUpdateCourse(req.body)
        if (error) return res.status(400).send({ status: 400, message: error.message });

        const userEmail = req.userEmail

        const user = await userModel.findByPk(userEmail)
        if (!user) return res.status(404).send(responseObject('User not Found', 404))


        const id = req.params.id;
        let course = await courseModel.findOne({
            where: {
                courseId: id,
                authorEmail: userEmail
            }
        })

        if (!course) return res.status(404).send(responseObject('Course Not Found', 404, "", "Course Not Exist"))

        let imageUrls = [...course.images];



        // if (value.deletedImages && value.deletedImages.length !== 0)
        //     if (imageUrls.length === 1) return res.status(400).send(responseObject("Can't Delete Last Image", 400, "", "Need Atleast One Image"))
        // imageUrls = imageUrls.filter(imageUrl => {
        //     console.log(value.deletedImages.includes(imageUrl));
        //     return !value.deletedImages.includes(imageUrl)
        // })

        if (req.files) {
            for (const file of req.files) {
                const cloudinaryResponse = await uploadToCloudinary(file, "znz/course");
                if (cloudinaryResponse.error) {
                    return res.status(500).json(responseObject("Internal server error during image upload", 500, "", cloudinaryResponse.error.message));
                }

                imageUrls.push(cloudinaryResponse.secure_url);
            }
        }


        // let course = await courseModel.create({ ...value, authorEmail: userEmail, images: imageUrls });

        await course.update({ ...value, authorEmail: userEmail, images: imageUrls })

        if (!course) return res.status(404).send(responseObject("Course not updated", 404))
        course = await courseModel.findByPk(course.courseId, { ...userAtrributesObject })


        return res.send(responseObject("Course Updated Successfully", 200, course))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject('Server Error', 500))
    }
}

module.exports = { getAllCourses, getASpecificCourse, getMyCourses, deleteASpecificCourse, createCourse, updateCourse }