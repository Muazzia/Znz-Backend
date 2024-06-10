const express = require('express');
const followerRouter = express.Router();

const { getAllFollower, getASpeceficFollower, createAFollowRequest, deleteAFollower, updateStatusOfFollower, getAllFollowRequests, getAllFollowing, deleteAFollowing, getAll } = require('../../controller/Follower/follower');

followerRouter.get('/follower', getAllFollower)
followerRouter.get('/following', getAllFollowing)
followerRouter.get('/request', getAllFollowRequests)
followerRouter.get('/getall', getAll)

followerRouter.get('/:id', getASpeceficFollower)

followerRouter.post('/', createAFollowRequest)

followerRouter.delete('/follower/:email', deleteAFollower)
followerRouter.delete('/following/:email', deleteAFollowing)

followerRouter.patch('/:id', updateStatusOfFollower)


module.exports = followerRouter