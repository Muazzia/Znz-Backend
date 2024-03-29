const express = require('express')
const productRouter = express.Router()
const { getAllProducts, createProduct, getAProduct } = require('../../controller/Product/product')
const { handleFileUpload } = require('../../middleware/multer')

productRouter.get('/', getAllProducts)
productRouter.post('/', handleFileUpload, createProduct)
productRouter.get('/:id', getAProduct)




module.exports = productRouter