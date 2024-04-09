const express = require('express')
const productRouter = express.Router()
const { getAllProducts, createProduct, getAProduct, deleteProduct } = require('../../controller/Product/product')
const { handleMulterUpload } = require('../../middleware/multer')

productRouter.get('/', getAllProducts)
productRouter.post('/', handleMulterUpload("images[]", false, 10), createProduct)
productRouter.get('/:id', getAProduct)
productRouter.delete("/:id", deleteProduct)



module.exports = productRouter