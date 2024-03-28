const express = require('express')
const productRouter = express.Router()
const { getAllProducts, createProduct } = require('../../controller/Product/product')
const { handleFileUpload } = require('../../middleware/multer')

productRouter.get('/', getAllProducts)
productRouter.post('/', handleFileUpload, createProduct)




module.exports = productRouter