const { object } = require("joi");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../../joiSchemas/Course/course");
const courseModel = require("../../models/courseModel");
const courseParentCategory = require("../../models/courseParentCategory");
const courseSubCategory = require("../../models/courseSubCategory");
const userModel = require("../../models/userModel");
const {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} = require("../../utils/cloudinary/cloudinary");
const { responseObject } = require("../../utils/responseObject");
const { sortData } = require("../../utils/sortdata");
const { Op } = require("sequelize");

const userAtrributesObject = {
  include: [
    {
      model: userModel,
      attributes: [
        "email",
        "profilePic",
        "coverPic",
        "firstName",
        "lastName",
        "bio",
      ],
    },
    {
      model: courseParentCategory,
      attributes: ["courseParentCategoryId", "name"],
    },
    {
      model: courseSubCategory,
      as: "subCategories",
      through: { attributes: [] },
    },
  ],
};

const getAllCourses = async (req, res) => {
  const attributes = [
    "parentCategory",
    "title",
    "mode",
    "courseDuration",
    "classDays",
    "classDuration",
    "courseFee",
    "description",
    "authorEmail",
  ];
  try {
    let data;
    if (req.query && Object.keys(req.query).length > 0) {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const queryParams = req.query;
      const whereClause = {};
      for (const key in queryParams) {
        if (attributes.includes(key)) {
          whereClause[key] = {
            [Op.like]: `%${queryParams[key]}%`,
          };
        }
      }
      data = await courseModel.findAll({
        where: whereClause,
        limit,
        offset,
        attributes: {
          exclude: ["parentCategory"],
        },
        ...userAtrributesObject,
      });
    } else {
      data = await courseModel.findAll({
        attributes: {
          exclude: ["parentCategory"],
        },
        ...userAtrributesObject,
      });
    }
    data = sortData(data);
    return res.status(200).send(responseObject("Successfull", 200, data));
  } catch (error) {
    return res.status(500).send(responseObject("Server Error", 500));
  }
};

const getMyCourses = async (req, res) => {
  try {
    let data;
    const userEmail = req.userEmail;
    if (req.query && Object.keys(req.query).length > 0) {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      data = await courseModel.findAll({
        where: {
          authorEmail: userEmail,
        },
        limit,
        offset,
        ...userAtrributesObject,
      });
    } else {
      data = await courseModel.findAll({
        where: {
          authorEmail: userEmail,
        },
        ...userAtrributesObject,
      });
    }
    data = sortData(data);
    return res
      .status(200)
      .send(responseObject("Successfully Reterived Data", 200, data));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Internal Server Error"));
  }
};

const getASpecificCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await courseModel.findByPk(id, {
      ...userAtrributesObject,
    });
    if (!course)
      return res.status(404).send(responseObject("Course Not Found", 404));
    // const data = await modifySinlge(course)
    return res.send(responseObject("Successful", 200, course));
  } catch (error) {
    return res.status(500).send(responseObject("Server Error", 500));
  }
};

const deleteASpecificCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await courseModel.findOne({
      where: {
        courseId: id,
        authorEmail: req.userEmail,
      },
      ...userAtrributesObject,
    });
    if (!course)
      return res.status(404).send(responseObject("Course Not Found", 404));
    await course.destroy();
    return res.send(responseObject("Deleted Successfully", 200, course));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};
//res.status(500).send(responseObject("", 500,"",""))
const createCourse = async (req, res) => {
  try {
    const { error, value } = validateCreateCourse(req.body);
    if (error)
      return res
        .status(400)
        .send(responseObject(error.message, 400, "", error.message));
    const userEmail = req.userEmail;
    const user = await userModel.findByPk(userEmail);
    if (!user)
      return res.status(404).send(responseObject("User not Found", 404));
    const parentCategory = await courseParentCategory.findByPk(
      value.parentCategory
    );
    if (!parentCategory)
      return res
        .status(404)
        .send(
          responseObject(
            "Parent Category found",
            404,
            "",
            "Parent Category id is invalid"
          )
        );
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .send(
          responseObject(
            "Missing required parameter - images",
            400,
            "",
            "Missing required parameter - images"
          )
        );
    }

    const imagesUploadResponse = await uploadMultipleToCloudinary(
      req.files,
      "course"
    );
    if (!imagesUploadResponse.isSuccess)
      return res
        .status(500)
        .send(
          responseObject(
            "Image Uplaod Error",
            500,
            "",
            imagesUploadResponse.error
          )
        );

    const imageUrls = imagesUploadResponse.data;
    let course = await courseModel.create({
      ...value,
      authorEmail: userEmail,
      images: imageUrls,
    });

    if (value.subCategories && value.subCategories.length > 0) {
      const subCategories = await courseSubCategory.findAll({
        where: {
          courseSubCategoryId: value.subCategories,
          parentCategoryId: value.parentCategory,
        },
      });
      if (subCategories && !subCategories.length > 0) {
        await course.destroy();
        return res
          .status(400)
          .send(
            responseObject(
              "Atleast One subcategory is required",
              "400",
              "",
              "Sub category id's are not valid"
            )
          );
      }
      await course.addSubCategories(subCategories);
    }

    if (!course)
      return res.status(404).send(responseObject("Course not created", 404));
    course = await courseModel.findByPk(course.courseId, {
      ...userAtrributesObject,
      attributes: {
        exclude: ["parentCategory"],
      },
    });
    return res.send(responseObject("Course Created Successfully", 200, course));
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject("Server Error", 500));
  }
};
// there are things need to change modify it again
const updateCourse = async (req, res) => {
  try {
    const { error, value } = validateUpdateCourse(req.body);
    if (error)
      return res.status(400).send({ status: 400, message: error.message });
    const userEmail = req.userEmail;
    const user = await userModel.findByPk(userEmail);
    if (!user)
      return res.status(404).send(responseObject("User not Found", 404));
    let parentCategory;
    if (value.parentCategory) {
      parentCategory = await courseParentCategory.findByPk(
        value.parentCategory
      );
      if (!parentCategory)
        return res
          .status(404)
          .send(
            responseObject(
              "parent category not found",
              404,
              "",
              "parent category id is not valid"
            )
          );
    }
    const id = req.params.id;
    let course = await courseModel.findOne({
      where: {
        courseId: id,
        authorEmail: userEmail,
      },
    });
    if (!course)
      return res
        .status(404)
        .send(responseObject("Course Not Found", 404, "", "Course Not Exist"));
    let imageUrls = [...course.images];
    if (value.deletedImages) {
      for (let i = 0; i < imageUrls.length; i++) {
        imageUrls = imageUrls.filter((url) => {
          return url === value.deletedImages[i] ? false : true;
        });
      }
      if (imageUrls.length === 0)
        return res
          .status(404)
          .send(
            responseObject(
              "Can't delete require atleast one image",
              400,
              "",
              "one image is a must"
            )
          );
    }
    if (
      value.parentCategory &&
      value.subCategories &&
      value.subCategories.length > 0
    ) {
      const subCategories = await courseSubCategory.findAll({
        where: {
          courseSubCategoryId: value.subCategories,
          parentCategoryId: value.parentCategory,
        },
      });
      if (subCategories && !subCategories.length > 0)
        return res
          .status(400)
          .send(
            responseObject(
              "Atleast One subcategory is required",
              "400",
              "",
              "Sub category id's are not valid"
            )
          ); 
      await course.setSubCategories([]);
      await course.addSubCategories(subCategories);
    }
    if (req.files) {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadToCloudinary(file, "znz/course");
        if (cloudinaryResponse.error) {
          return res
            .status(500)
            .json(
              responseObject(
                "Internal server error during image upload",
                500,
                "",
                cloudinaryResponse.error.message
              )
            );
        }
        imageUrls.push(cloudinaryResponse.secure_url);
      }
    }
    await course.update({
      ...value,
      authorEmail: userEmail,
      images: imageUrls,
    });
    course = await courseModel.findByPk(course.courseId, {
      ...userAtrributesObject,
    });
    return res.send(responseObject("Course Updated Successfully", 200, course));
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject("Server Error", 500));
  }
};

module.exports = {
  getAllCourses,
  getASpecificCourse,
  getMyCourses,
  deleteASpecificCourse,
  createCourse,
  updateCourse,
};
