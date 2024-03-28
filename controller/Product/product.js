const { validateProduct } = require('../../joiSchemas/Product/product')
const productModel = require('../../models/product')
const userModel = require('../../models/userModel')
const { uploadToCloudinary } = require('../../utils/cloudinary/cloudinary')
const { responseObject } = require('../../utils/responseObject')

const getAllProducts = async (req, res) => {
    try {
        const data = await productModel.findAll({
            include: [{ model: userModel, attributes: ["email", "firstName", "lastName", "profilePic"] }]
        })

        return res.status(200).send(responseObject("Succesfully Retreived Data", 200, data))

    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const createProduct = async (req, res) => {
    try {
        const { error, value } = validateProduct(req.body)
        console.log(req.body);
        if (error) return res.status(400).send(responseObject(error.message, 400, "", error.message))

        const imageUrls = [];

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing required parameter - images",
            });
        }

        if (req.files) {
            for (const file of req.files) {
                const cloudinaryResponse = await uploadToCloudinary(file);
                if (cloudinaryResponse.error) {
                    return res.status(500).json(responseObject("Internal server error during image upload", 500, "", cloudinaryResponse.error.message));
                }

                imageUrls.push(cloudinaryResponse.secure_url);
            }
        }

        const product = await productModel.create({
            ...value,
            images: imageUrls,
            authorEmail: req.userEmail
        })

        if (!product) return res.status(400).send(responseObject("Can't Upload At the moment", 400, "", "Product upload error try again"))

        return res.status(200).send(responseObject("Successfully Created", 200, product))

    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

module.exports = { getAllProducts, createProduct }