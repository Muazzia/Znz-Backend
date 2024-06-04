const express = require('express')
const adminProductRouter = express.Router();
const { getAllProducts, getAllProductsForASpecificUser, deleteAProduct, createParentCat, createSubCat, deleteParentCat, deleteSubCat } = require("../../../controller/Admin/product");
// const { deleteSubCat } = require('../../../controller/Admin/course');


// categories routes



adminProductRouter.post('/parent', createParentCat)
adminProductRouter.post('/sub', createSubCat)

adminProductRouter.delete('/parent/:id', deleteParentCat)
adminProductRouter.delete('/sub/:id', deleteSubCat)

// adminProductRouter.put('/parent/:id')
// adminProductRouter.put('/sub/:id')


// 
adminProductRouter.get('', getAllProducts)
adminProductRouter.get('/:userEmail', getAllProductsForASpecificUser)
adminProductRouter.delete('/:id', deleteAProduct)

module.exports = adminProductRouter