const express = require('express');
const followerRouter = express.Router();

const { getAllFollower, getASpeceficFollower, createAFollower, deleteAFollower } = require('../../controller/Follower/follower');

followerRouter.get('/', getAllFollower)
followerRouter.get('/:id', getASpeceficFollower)
followerRouter.post('/', createAFollower)
followerRouter.delete('/:id', deleteAFollower)

module.exports = followerRouter