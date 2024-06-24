const express = require('express')
const interestRouter = express.Router();
const { getAInterest,updateInterest,deleteInterest,createInterest,getAllInterest } = require("../../../controller/Admin/interest/interest");
// const { deleteSubCat } = require('../../../controller/Admin/course');


// categories routes



interestRouter.post('/createInterest', createInterest)

interestRouter.delete('/deleteinterest/:id', deleteInterest)

// adminProductRouter.put('/parent/:id')
// adminProductRouter.put('/sub/:id')


// 
interestRouter.get('', getAllInterest)
interestRouter.get('/getAInterest/:id', getAInterest)
interestRouter.put('/updateInterest/id:',updateInterest)


module.exports = adminProductRouter