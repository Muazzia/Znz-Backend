const express = require("express")

const router = express.Router();

const { getAInterest, getAllInterest } = require("../controller/Admin/interest")

const { getAParentCat, getAllSubCat, getAllParentCat } = require('../controller/Admin/course')
const { getAllParentCat: getAllProductParentCat, getAllSubCat: getAllProductSubCat, getAParentCat: getAProductParentCat } = require("../controller/Admin/product");

router.get('/course/parent', getAllParentCat)
router.get('/course/sub', getAllSubCat)
router.get('/course/parent/:id', getAParentCat)
router.get('/course/sub/:id', getAllSubCat)

// getting product categories. Placed it outside to no admin check is avoided
router.get('/product/parent', getAllProductParentCat)
router.get('/product/sub', getAllProductSubCat)
router.get('/product/parent/:id', getAProductParentCat)

// getting interests. Placed it outside to no admin check is avoided
router.get('/interest', getAllInterest)
router.get('/interest/:id', getAInterest)

module.exports = router;