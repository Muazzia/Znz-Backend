const express = require('express')
const productRouter = express.Router()
const { getAllProducts, createProduct, getAProduct, deleteProduct, getMyProducts } = require('../../controller/Product/product')
const { handleMulterUpload } = require('../../middleware/multer')
const productModel = require('../../models/product')

productRouter.get('/', getAllProducts)
productRouter.get('/my-products', getMyProducts)

productRouter.post('/', handleMulterUpload("images[]", false, 10), createProduct)
productRouter.get('/:id', getAProduct)
productRouter.delete("/:id", deleteProduct)

productRouter.patch("/updateAllProdcuts", async (req, res) => {
    const products = await productModel.findAll();

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const image = product.images[0];
        if (image) product.thumbnail = image;

        await product.save();
    }

    return res.status(200).send("all ok")
})



module.exports = productRouter