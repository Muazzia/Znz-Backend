const interestModel = require("../../../models/interestModel")
const { validateInterest } = require("../../../joiSchemas/Admin/interest");
const { responseObject } = require("../../../utils/responseObject");


const createInterest = async (req, res) => {
  const { error, value } = validateInterest(req.body)
  if (error) return res.status(400).send(error.message)

  try {
    const checkInterest = await interestModel.findOne({
      where: { name: value.name }
    })
    if (checkInterest) return res.status(409).json(responseObject("Interest already exists", 400, "", "Interst already exist"));

    const newInterest = await interestModel.create({
      name: value.name
    });
    return res.status(200).json(responseObject("Interest created succesfully", 200, newInterest));
  } catch (error) {
    return res.status(500).json(responseObject("Internal Server Error", 500, error));
  }
};

const updateInterest = async (req, res) => {
  const { error, value } = validateInterest(req.body)
  if (error) return res.status(400).send(error.message)

  try {
    const { id } = req.params
    const interest = await interestModel.findByPk(id)
    await interest.update({ name: value.name })

    return res.status(200).json(responseObject("Interest updated succesfully", 200, interest));
  } catch (error) {
    console.log("internal server error updating interest", error);
    return res.status(500).json(responseObject("Internal Server Error", 500, "", error));
  }
};

const deleteInterest = async (req, res) => {
  try {
    const { id } = req.params
    const interest = await interestModel.findByPk(id)

    if (!interest) return res.status(404).send(responseObject("Interest Not Found", 404, "", "Id is not valid"))
    await interest.destroy()

    return res.status(200).json(responseObject("Interest Deleted Successfully", 200, interest));
  } catch (error) {
    return res.status(500).json(responseObject("Internal Server Error", 500, "", error));
  }
};


const getAllInterest = async (req, res) => {
  try {
    const interest = await interestModel.findAll()

    res.status(200).json(responseObject("All interset retrived Sucessfully", 200, interest));
  } catch (error) {
    console.log("internal server error getting all interest", error);
    return res.status(500).json(responseObject("Internal Server Error", 500, "", error));
  }
};

const getAInterest = async (req, res) => {
  try {
    const { id } = req.params
    const interest = await interestModel.findByPk(id)

    return res.status(200).json(
      responseObject("Intereset retrived successfully", 200, interest));

  } catch (error) {
    return res.status(500).json(responseObject("Internal Server Error", 500, "", error));
  }
};


module.exports = { createInterest, getAInterest, getAllInterest, deleteInterest, updateInterest }