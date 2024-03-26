const { validateAdminUpdateUser } = require("../../joiSchemas/Admin/admin")
const courseModel = require("../../models/courseModel")
const userModel = require("../../models/userModel")
const { responseObject } = require("../../utils/responseObject")


const getAllUser = async (req, res) => {
    try {
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
        const data = await courseModel.findAll({
            include: [{ model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName'] }]
        })

        return res.status(200).send(responseObject("Successfully Retrieved", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

module.exports = { getAllUser, updateUser, getAllCourses }