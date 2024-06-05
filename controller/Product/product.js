const { validateProduct } = require('../../joiSchemas/Product/product')
const productModel = require('../../models/product')
const userModel = require('../../models/userModel')
const { uploadMultipleToCloudinary } = require('../../utils/cloudinary/cloudinary')
const { responseObject } = require('../../utils/responseObject')
const { } = require('../../')
const productParentCategory = require('../../models/productParentCategory')
const productSubCategory = require('../../models/productSubCategory')

const userAtrributesObject = {
    include: [
        { model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName'] },
        { model: productParentCategory, attributes: ['productParentCategoryId', 'name'] },
        { model: productSubCategory, as: 'subCategories', through: { attributes: [] } }
    ]
}

const getAllProducts = async (req, res) => {
    try {
        let allProductData;
        if (Object.keys(req.query).length > 0) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            allProductData = await productModel.findAll({
                ...userAtrributesObject,
                limit,
                offset
            })
        } else {
            allProductData = await productModel.findAll({
                ...userAtrributesObject,
            })
        }
        return res.status(200).send(responseObject("Succesfully Retreived Data", 200, allProductData))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const getMyProducts = async (req, res) => {
    try {
        const userEmail = req.userEmail;
        let productData;
        if (Object.keys(req.query).length > 0) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            productData = await productModel.findAll({
                where: {
                    authorEmail: userEmail,
                },
                ...userAtrributesObject,
                limit,
                offset
            });
        } else {
            productData = await productModel.findAll({
                where: {
                    authorEmail: userEmail,
                },
                ...userAtrributesObject,
            });
        }
        const sortedData = productData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return res.status(200).send(responseObject("Successfully Reterived Data", 200, sortedData))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const getAProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findByPk(id, {
            ...userAtrributesObject
        })
        if (!product) return res.status(404).send(responseObject("Not Found", 404, "", "ID is Not Valid"))
        return res.status(200).send(responseObject("Successfully Retrieved Data", 200, product))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const createProduct = async (req, res) => {
    try {

        const { error, value } = validateProduct(req.body)
        if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

        const parentCategory = await productParentCategory.findByPk(value.parentCategory)
        if (!parentCategory) return res.status(404).send(responseObject("Parent Category found", 404, "", "Parent Category id is invalid"))

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing required parameter - images",
            });
        }

        const imagesUploadResponse = await uploadMultipleToCloudinary(req.files, "product")
        if (!imagesUploadResponse.isSuccess) return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error: imagesUploadResponse.error,
        });

        const imageUrls = imagesUploadResponse.data

        let product = await productModel.create({
            ...value,
            images: imageUrls,
            thumbnail: imageUrls[0],
            authorEmail: req.userEmail
        })

        if (value.subCategories && value.subCategories.length > 0) {
            const subCategories = await productSubCategory.findAll({
                where: {
                    productSubCategoryId: value.subCategories,
                    parentCategoryId: value.parentCategory
                },
            });
            if (subCategories && !subCategories.length > 0) {
                await product.destroy();
                return res.status(400).send(responseObject("Atleast One subcategory is required", "400", "", "Sub category id's are not valid"))
            }
            await product.addSubCategories(subCategories);
        }


        product = await productModel.findByPk(product.productId, {
            ...userAtrributesObject, attributes: {
                exclude: ['parentCategory']
            }
        })

        return res.status(200).send(responseObject("Successfully Created", 200, product))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const authorEmail = req.userEmail;
        const product = await productModel.findOne({
            where: {
                productId,
                authorEmail
            },
            ...userAtrributesObject
        })
        if (!product) return res.status(404).send(responseObject("Product not found", 404, "", "Id is not valid"))
        await product.destroy();
        return res.status(200).send(responseObject("Successfully Deleted", 200, product))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

module.exports = { getAllProducts, createProduct, getAProduct, deleteProduct, getMyProducts }