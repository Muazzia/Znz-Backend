const productParentCategory = require("../../../models/productParentCategory")
const userModel = require("../../../models/userModel")
const productModel = require("../../../models/product")

const { responseObject } = require("../../../utils/responseObject")

// using same validation for both
const { validateCreateParentCat, validateCreateSubCat } = require("../../../joiSchemas/Admin/course")
const productSubCategory = require("../../../models/productSubCategory")


const subCategoryOptionObject = {
    include: [{ model: productParentCategory, attributes: ["productParentCategoryId", "name"] }],
    attributes: {
        exclude: ["parentCategoryId"]
    }
}


const getAllParentCat = async (req, res) => {
    try {
        const data = await productParentCategory.findAll();
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
            data = await productSubCategory.findAll({
                ...subCategoryOptionObject, where: {
                    parentCategoryId
                }
            });
        } else {
            data = await productSubCategory.findAll({ ...subCategoryOptionObject })
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
        const data = await productParentCategory.findByPk(id);

        if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "parent category not found"))
        return res.status(200).send(responseObject("Succesfully retrieved Data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
    }
}

const getASubCat = async (req, res) => {
    try {
        const id = req.params.id
        const data = await productParentCategory.findByPk(id, { ...subCategoryOptionObject });

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

        const category = await productParentCategory.findOne({
            where: {
                name: value.name
            }
        })

        if (category) return res.status(400).send(responseObject("category with same name already exist", 400, "", "category with same name already exist"))

        const data = await productParentCategory.create({ ...value })

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

        const parentCategory = await productParentCategory.findByPk(value.parentCategoryId);

        if (!parentCategory) return res.status(400).send(responseObject("Parent Category is not valid", 400, "Parent Category not found"))

        const category = await productSubCategory.findOne({
            where: {
                name: value.name
            }
        })

        if (category) return res.status(400).send(responseObject("category with same name already exist", 400, "", "category with same name already exist"))

        const data = await productSubCategory.create({ ...value })
        const subCat = await productSubCategory.findByPk(data.productSubCategoryId, { ...subCategoryOptionObject })

        return res.status(201).send(responseObject("created successfully", 201, subCat))
    } catch (error) {
        return res.status(500).send(responseObject("Internal Server Error", 500, "Server Error"))
    }
}


// categories 











// const deleteParentCat = async (req, res) => {
//     try {
//         const id = req.params.id
//         const data = await courseParentCat.findByPk(id);

//         if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "parent category not found"))

//         await data.destroy()
//         return res.status(200).send(responseObject("Succesfully deleted data", 200, data))
//     } catch (error) {
//         return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
//     }
// }

// const deleteSubCat = async (req, res) => {
//     try {
//         const id = req.params.id
//         const data = await courseSubCat.findByPk(id, { ...subCategoryOptionObject });

//         if (!data) return res.status(404).send(responseObject("Id is not valid", 404, "sub category not found"))

//         await data.destroy()
//         return res.status(200).send(responseObject("Succesfully deleted data", 200, data))
//     } catch (error) {
//         return res.status(500).send(responseObject("Internal Server Error", 500, "", "Server Error"))
//     }
// }




// 
const getAllProductsForASpecificUser = async (req, res) => {
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
const getAllProducts = async (req, res) => {
    try {
        const data = await productModel.findAll({
            include: [{ model: userModel, attributes: ["email", "firstName", "lastName"] }]
        })

        return res.status(200).send(responseObject("Successfully Retrieved Data", 200, data))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const deleteAProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await productModel.findByPk(id, {
            include: [{ model: userModel, attributes: ["email", "firstName", "lastName"] }]
        })

        if (!product) return res.status(404).send(responseObject("Product Not Found", 404, "", "Id is not valid"))

        await product.destroy()
        return res.status(200).send(responseObject("Product Deleted Successfully", 200, product))

    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}


module.exports = { getAllProducts, getAllProductsForASpecificUser, deleteAProduct, getAllParentCat, getAllSubCat, getAParentCat, getASubCat, createSubCat, createParentCat }