const express = require('express')
const adminProductRouter = express.Router();
const { getAllProducts, getAllProductsForASpecificUser, deleteAProduct } = require("../../../controller/Admin/product")

adminProductRouter.get('', getAllProducts)
adminProductRouter.get('/:userEmail', getAllProductsForASpecificUser)
adminProductRouter.delete('/:id', deleteAProduct)

module.exports = adminProductRouter