const interestModel = require("../../../models/interestModel")
const validateInterest = require("../../../joiSchemas/Admin/interest/interest")


const createInterest = async (req, res) => {
    const { error, value } = validateInterest(req.body)
    if (error) return res.status(400).send(error.message)
    try {
      const newInterest = await interestModel.create({
        name: value.name
      });
      res.status(200).json({
        statusCode: 200,
        message: "Interest created succesfully",
        data: newInterest
      });
      
    } catch (error) {
      console.log("internal server error creating interest", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
      });
    }
  };

  const updateInterest = async (req, res) => {
    const { error, value } = validateInterest(req.body)
    if (error) return res.status(400).send(error.message)
    try {
      const {id}= req.params
      const interest = await interestModel.findByPk(id)
      // const update = user.set(req.body);
      // await update.save();
      // await interest.({
      //   where: { id: id },
      // });\
      await interest.update({name:value.name})
      res.status(200).json({
        statusCode: 200,
        message: "Interest updated succesfully",
        data: newInterest
      });
      
    } catch (error) {
      console.log("internal server error updating interest", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
      });
    }
  };

  const deleteInterest = async (req, res) => {
    try {
      const {id}= req.params
      const interest = await interestModel.findByPk(id)
      await interest.destroy({name:value.name})
      res.status(200).json({
        statusCode: 200,
        message: "Interest deleted succesfully",
        data: newInterest
      });
      
    } catch (error) {
      console.log("internal server error deleting interest", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
      });
    }
  };


  const getAllInterest = async (req, res) => {
    try {
      const interest = await interestModel.findAll()
      res.status(200).json({
        statusCode: 200,
        message: "ALL Interest retrived succesfully",
        data: interest
      });
    } catch (error) {
      console.log("internal server error getting all interest", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
      });
    }
  };
  const getAInterest = async (req, res) => {
    try {
      const {id}= req.params
      const interest = await interestModel.findByPk(id)
      res.status(200).json({
        statusCode: 200,
        message: "Interest retrived succesfully",
        data: interest
      });
      
    } catch (error) {
      console.log("internal server error getting interest", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
      });
    }
  };
  

  module.exports = { createInterest,getAInterest,getAllInterest,deleteInterest,updateInterest}