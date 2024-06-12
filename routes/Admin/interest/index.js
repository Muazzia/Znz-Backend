const express = require('express')
const interestRouter = express.Router();
const { getAInterest,updateInterest,deleteInterest,createInterest,getAllInterest } = require("../../../controller/Admin/interest");



interestRouter.post('/', createInterest)
interestRouter.delete('/:id', deleteInterest)
interestRouter.get('/', getAllInterest)
interestRouter.get('/:id', getAInterest)
interestRouter.put('/id:',updateInterest)
module.exports = interestRouter