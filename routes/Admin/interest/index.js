const express = require('express')
const interestRouter = express.Router();
const { updateInterest, deleteInterest, createInterest } = require("../../../controller/Admin/interest");



interestRouter.post('/', createInterest)
interestRouter.delete('/:id', deleteInterest)
interestRouter.put('/:id', updateInterest)
module.exports = interestRouter