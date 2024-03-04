const express = require('express')

const tokenRouter = express.Router()

tokenRouter.get('/', async (req, res) => {
    try {
        return res.status(200).send({ status: 200, message: 'Token is Valid' })
    } catch (error) {
        return res.status(401).send({ status: 401, message: 'Token is in-Valid' })
    }
})


module.exports = tokenRouter