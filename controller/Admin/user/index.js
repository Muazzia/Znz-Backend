const { validateAdminUpdateUser } = require("../../../joiSchemas/Admin/admin")

const userModel = require("../../../models/userModel")

const { responseObject } = require("../../../utils/responseObject")
const { Sequelize, Op } = require('sequelize');



const getAllUser = async (req, res) => {
    try {
        let userInput = req.query.filter;
        const chkisBlockedQuery = Object.keys(req.query);

        if (userInput) {
            userInput = userInput.replace(/\s+/g, '');
            let data;

            if (chkisBlockedQuery.includes("isBlocked")) {
                data = await userModel.findAll({
                    attributes: { exclude: ['password'] }, // Exclude password field
                    where: {
                        [Op.or]: [
                            Sequelize.literal(`CONCAT(firstName, lastName) LIKE '%${userInput}%'`), // Search in concatenated name
                            { email: { [Op.like]: `%${userInput}%` } } // Search in email field with wildcard
                        ],
                        isBlocked: req.query.isBlocked === "true" ? true : false
                    }
                });

            }
            else {
                data = await userModel.findAll({
                    attributes: { exclude: ['password'] }, // Exclude password field
                    where: {
                        [Op.or]: [
                            Sequelize.literal(`CONCAT(firstName, lastName) LIKE '%${userInput}%'`), // Search in concatenated name
                            { email: { [Op.like]: `%${userInput}%` } } // Search in email field with wildcard
                        ]
                    }
                });
            }
            return res.status(200).send(responseObject("Successfully Received", 200, data));
        }
        const data = await userModel.findAll({
            where: {
                isBlocked: req.query.isBlocked === "true" ? true : false
            },
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

        if (user.email === req.userEmail) return res.status(400).send(responseObject("You can't block yourself", 400, "", "The option to block yourself is not available."))

        await user.update({ isBlocked: value.isBlocked })

        return res.status(200).send(responseObject('Updated Successfully', 200, user))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}


module.exports = { getAllUser, updateUser }