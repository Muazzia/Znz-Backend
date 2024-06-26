const courseModel = require("../../../models/courseModel")
const { responseObject } = require("../../../utils/responseObject")
const userModel = require("../../../models/userModel")

const courseParentCat = require('../../../models/courseParentCategory')
const courseSubCat = require('../../../models/courseSubCategory')
const { validateCreateParentCat, validateCreateSubCat } = require("../../../joiSchemas/Admin/course")


const subCategoryOptionObject = {
    include: [{ model: courseParentCat, attributes: ["courseParentCategoryId", "name"] }],
    attributes: {
        exclude: ["parentCategoryId"]
    }
}

const getAllParentCat = async (req, res) => {
    try {
        const data = await courseParentCat.findAll();
        return res.status(200).send(responseObject("Succesfully retrieved Data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const getAllSubCat = async (req, res) => {
    try {
        let data;
        if (Object.keys(req.query).length > 0) {
            const parentCategoryId = req.query.parentCategoryId
            data = await courseSubCat.findAll({
                ...subCategoryOptionObject, where: {
                    parentCategoryId
                }
            });
        } else {
            data = await courseSubCat.findAll({ ...subCategoryOptionObject })
        }

        return res.status(200).send(responseObject("Succesfully retrieved Data", 200, data))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const getAParentCat = async (req, res) => {
    try {
        const id = req.params.id
        const data = await courseParentCat.findByPk(id);

        if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "parent category not found"))
        return res.status(200).send(responseObject("Succesfully retrieved Data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const getASubCat = async (req, res) => {
    try {
        const id = req.params.id
        const data = await courseParentCat.findByPk(id, { ...subCategoryOptionObject });

        if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "sub category not found"))
        return res.status(200).send(responseObject("Succesfully retrieved Data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const createParentCat = async (req, res) => {
    try {
        const { error, value } = validateCreateParentCat(req.body)
        if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

        const category = await courseParentCat.findOne({
            where: {
                name: value.name
            }
        })

        if (category) return res.status(400).send(responseObject("category with same name already exist", 400, "", "category with same name already exist"))

        const data = await courseParentCat.create({ ...value })

        return res.status(201).send(responseObject("created successfully", 201, data))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Internal Server Error", 500, "Server Error"))
    }
}

const createSubCat = async (req, res) => {
    try {
        const { error, value } = validateCreateSubCat(req.body)
        if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

        const parentCategory = await courseParentCat.findByPk(value.parentCategoryId);

        if (!parentCategory) return res.status(400).send(responseObject("Parent Category is not valid", 400, "Parent Category not found"))

        const category = await courseSubCat.findOne({
            where: {
                name: value.name
            }
        })

        if (category) return res.status(400).send(responseObject("category with same name already exist", 400, "", "category with same name already exist"))

        const data = await courseSubCat.create({ ...value })
        const subCat = await courseSubCat.findByPk(data.courseSubCategoryId, { ...subCategoryOptionObject })

        return res.status(201).send(responseObject("created successfully", 201, subCat))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "Server Error"))
    }
}

const deleteParentCat = async (req, res) => {
    try {
        const id = req.params.id
        const data = await courseParentCat.findByPk(id);

        if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "parent category not found"))

        await data.destroy()
        return res.status(200).send(responseObject("Succesfully deleted data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const deleteSubCat = async (req, res) => {
    try {
        const id = req.params.id
        const data = await courseSubCat.findByPk(id, { ...subCategoryOptionObject });

        if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "sub category not found"))

        await data.destroy()
        return res.status(200).send(responseObject("Succesfully deleted data", 200, data))
    } catch (error) {
        console.log();
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}


// need to create update routes
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