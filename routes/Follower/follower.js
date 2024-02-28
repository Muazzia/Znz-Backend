const express = require('express');
const followerRouter = express.Router();

const { getAllFollower, getASpeceficFollower, createAFollower, deleteAFollower, updateStatusOfFollower, getAllFollowRequests, getAllFollowing } = require('../../controller/Follower/follower');

followerRouter.get('/', getAllFollower)
followerRouter.get('/following', getAllFollowing)
followerRouter.get('/request', getAllFollowRequests)

followerRouter.get('/:id', getASpeceficFollower)
followerRouter.post('/', createAFollower)
followerRouter.delete('/:id', deleteAFollower)

followerRouter.patch('/:id', updateStatusOfFollower)


module.exports = followerRouter