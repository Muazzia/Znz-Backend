const express = require('express')
const productRouter = express.Router()
const { getAllProducts, createProduct, getAProduct, deleteProduct } = require('../../controller/Product/product')
const { handleFileUpload, handleProductUpload } = require('../../middleware/multer')

productRouter.get('/', getAllProducts)
productRouter.post('/', handleProductUpload, createProduct)
productRouter.get('/:id', getAProduct)
productRouter.delete("/:id", deleteProduct)



module.exports = productRouter