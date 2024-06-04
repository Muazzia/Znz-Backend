const express = require('express')
const adminProductRouter = express.Router();
const { getAllProducts, getAllProductsForASpecificUser, deleteAProduct, getAllParentCat, getAllSubCat, createParentCat, createSubCat } = require("../../../controller/Admin/product");


// categories routes


// adminProductRouter.get('/parent/:id', getAParentCat)
// adminProductRouter.get('/sub/:id', getAllSubCat)

adminProductRouter.post('/parent', createParentCat)
adminProductRouter.post('/sub', createSubCat)

// adminProductRouter.delete('/parent/:id', deleteParentCat)
// adminProductRouter.delete('/sub/:id', deleteSubCat)

// adminProductRouter.put('/parent/:id')
// adminProductRouter.put('/sub/:id')


// 
adminProductRouter.get('', getAllProducts)
adminProductRouter.get('/:userEmail', getAllProductsForASpecificUser)
adminProductRouter.delete('/:id', deleteAProduct)

module.exports = adminProductRouter