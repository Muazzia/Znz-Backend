const { validateAdminUpdateUser } = require("../../joiSchemas/Admin/admin")
const courseModel = require("../../models/courseModel")
const userModel = require("../../models/userModel")
const productModel = require("../../models/product")

const { responseObject } = require("../../utils/responseObject")
const { Sequelize, Op } = require('sequelize');



const getAllUser = async (req, res) => {
    try {
        let userInput = req.query.filter;

        if (userInput) {
            console.log(userInput);
            userInput = userInput.replace(/\s+/g, '');

            const data = await userModel.findAll({
                attributes: { exclude: ['password'] }, // Exclude password field
                where: {
                    [Op.or]: [
                        Sequelize.literal(`CONCAT(firstName, lastName) LIKE '%${userInput}%'`), // Search in concatenated name
                        { email: { [Op.like]: `%${userInput}%` } } // Search in email field with wildcard
                    ]
                }
            });

            return res.status(200).send(responseObject("Successfully Received", 200, data));
        }
        const data = await userModel.findAll({
            attributes: {
                exclude: ['password']
            }
        })
        return res.status(200).send(responseObject("Successfully Received", 200, data))

    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error try again"))
    }
}

const getAllProducts = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        if (userEmail) {
            const data = await productModel.findAll({
                where: {
                    authorEmail: userEmail
                }
            })
            return res.status(200).send(responseObject("Successfully Retrieved", 200, data))
        } else {
            return res.status(400).send(responseObject("User have not listed any product", 400))

        }
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const updateUser = async (req, res) => {
    try {
        const { error, value } = validateAdminUpdateUser(req.body)
        if (error) return res.status(400).send(responseObject(error.message, 400, "", "Bad Request"));

        const user = await userModel.findByPk(value.userEmail)
        if (!user) return res.status(404).send(responseObject("User not Found", 404, "", "User not Found"))

        await user.update({ isBlocked: value.isBlocked })

        return res.status(200).send(responseObject('Updated Successfully', 200, user))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

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

module.exports = { getAllUser, updateUser, getAllCourses, deleteCourse, getAllProducts }