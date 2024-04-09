const { validateProduct } = require('../../joiSchemas/Product/product')
const productModel = require('../../models/product')
const userModel = require('../../models/userModel')
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../../utils/cloudinary/cloudinary')
const { responseObject } = require('../../utils/responseObject')

const userAtrributesObject = {
    include: [{ model: userModel, attributes: ['email', 'profilePic', 'coverPic', 'firstName', 'lastName'] }]
}

const getAllProducts = async (req, res) => {
    try {
        const data = await productModel.findAll({
            ...userAtrributesObject
        })

        return res.status(200).send(responseObject("Succesfully Retreived Data", 200, data))

    } catch (error) {
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
        console.log(req.body);
        if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))


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
            authorEmail: req.userEmail
        })

        if (!product) return res.status(400).send(responseObject("Can't Upload At the moment", 400, "", "Product upload error try again"))
        product = await productModel.findByPk(product.productId, {
            ...userAtrributesObject
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

module.exports = { getAllProducts, createProduct, getAProduct, deleteProduct }