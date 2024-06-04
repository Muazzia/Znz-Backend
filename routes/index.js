const express = require('express')
const { checkJWT, adminCheckJWT } = require("../middleware/authenticationMiddleware");
const checkExistingToken = require("../middleware/previousToken");

const router = express.Router();

const authR = require("../routes/Auth/auth");
const adminR = require('../routes/Admin/index')
const userR = require("../routes/User/userRoutes");
const storyR = require('../routes/Story/story')
const postR = require("../routes/Post/postRoutes");
const likeR = require("../routes/Like/likeRoutes");
const postCommentR = require('../routes/PostComment/postComment')
const tokenR = require('../routes/Token/token')
const coursesR = require('../routes/Course/course')
const followerR = require('../routes/Follower/follower')
const productR = require('../routes/Product/product')


const { getAParentCat, getAllSubCat, getAllParentCat } = require('../controller/Admin/course')
const { getAllParentCat: getAllProductParentCat, getAllSubCat: getAllProductSubCat, getAParentCat: getAProductParentCat } = require("../controller/Admin/product")



router.use('/validatetoken', checkExistingToken, checkJWT, tokenR)
router.use("/auth/user", authR);

// getting course categories. Placed it outside to no admin check is avoided
router.get('/course/parent', checkExistingToken, checkJWT, getAllParentCat)
router.get('/course/sub', checkExistingToken, checkJWT, getAllSubCat)
router.get('/course/parent/:id', checkExistingToken, checkJWT, getAParentCat)
router.get('/course/sub/:id', checkExistingToken, checkJWT, getAllSubCat)

// getting product categories. Placed it outside to no admin check is avoided
router.get('/product/parent', checkExistingToken, checkJWT, getAllProductParentCat)
router.get('/product/sub', checkExistingToken, checkJWT, getAllProductSubCat)
router.get('/product/parent/:id', checkExistingToken, checkJWT, getAProductParentCat)
// router.get('/product/sub/:id', checkExistingToken, checkJWT, getAllSubCat)yahan likhs


router.use('/admin', adminCheckJWT, adminR)

router.use("/user", userR);

router.use("/user/story", checkExistingToken, checkJWT, storyR);

router.use("/user/post", checkExistingToken, checkJWT, postR);
router.use("/user/post/like", checkExistingToken, checkJWT, likeR);
router.use('/user/post/comment', checkExistingToken, checkJWT, postCommentR)
router.use('/user/connection', checkExistingToken, checkJWT, followerR)

router.use('/course', checkExistingToken, checkJWT, coursesR)
router.use('/product', checkExistingToken, checkJWT, productR)



module.exports = router