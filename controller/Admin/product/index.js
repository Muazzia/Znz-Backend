const userModel = require("../../../models/userModel")
const productModel = require("../../../models/product")

const { responseObject } = require("../../../utils/responseObject")


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


module.exports = { getAllProducts, getAllProductsForASpecificUser, deleteAProduct }