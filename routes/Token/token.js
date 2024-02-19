const express = require('express')

const tokenRouter = express.Router()

tokenRouter.post('/', async (req, res) => {
    try {
        return res.status(200).send('Token in Valid')
    } catch (error) {
        return res.status(500).send('Server Error')
    }
})


module.exports = tokenRouter