const courseModel = require("../../../models/courseModel")
const { responseObject } = require("../../../utils/responseObject")
const userModel = require("../../../models/userModel")



const getAllParentCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const getAllSubCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const getAParentCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const getASubCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const createParentCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const createSubCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const deleteParentCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const deleteSubCat = async (req, res) => {

}

const updateParentCat = async (req, res) => {
    try {

    } catch (error) {

    }
}

const updateSubCat = async (req, res) => {
    try {

    } catch (error) {

    }
}


// course controllers
const getAllCourses = async (req, res) => {
    try {
        const optionObject = {
            include: [{ model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName'] }]
        }
        const userEmail = req.query.userEmail
        let data;
        if (userEmail) {
            data = await courseModel.findAll({
                where: {
                    authorEmail: userEmail
                },
                ...optionObject
            })
        } else {

            data = await courseModel.findAll(optionObject)
        }

        return res.status(200).send(responseObject("Successfully Retrieved", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const getAllCoursesOfASpecificUser = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;

        const data = await courseModel.findAll({
            where: {
                authorEmail: userEmail
            }
        })
        return res.status(200).send(responseObject("Successfully Retrieved", 200, data))

    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;
        // const course = await courseModel.findByPk(id, {
        //     include: [{ model: userModel, attributes: ['email', "firstName", "lastName", "profilePic"] }],
        // })
        const course = await courseModel.findByPk(id, {
            include: [{ model: userModel, attributes: ["email", "firstName", "lastName", "profilePic"] }]
        })
        if (!course) return res.status(404).send(responseObject("Course Not Found", 404, "", "Course Id is not valid"))

        await course.destroy()
        return res.status(200).send(responseObject("Successfully Deleted Course", 200, course))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

module.exports = { getAllCourses, getAllCoursesOfASpecificUser, deleteCourse, getAllParentCat, getAllSubCat, getAParentCat, getASubCat, createParentCat, createSubCat, deleteParentCat, deleteSubCat, updateParentCat, updateSubCat }