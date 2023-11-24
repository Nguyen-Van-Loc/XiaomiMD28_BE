const cloudinary = require("cloudinary").v2;
const { json } = require("body-parser");
const { Promotion } = require("../models");
exports.getData = async (req, res) => {
  try {
    const listCategory = await Promotion.findAll(); // Gọi phương thức findAll trên đối tượng Promotion
    return res.status(200).json({ status: 200, data: listCategory });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: 404, message: "Not found" });
  }
};
exports.createPromotion = async (req, res) => {
  const { name, image, description, discount, startDate, endDate } = req.body;
  const imageFlie = req.file;
  try {
    if (
      !name ||
      (!image && !imageFlie) ||
      !description ||
      !discount ||
      !startDate ||
      !endDate
    ) {
      if (imageFlie) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (imageFlie) {
      const result = await cloudinary.uploader.upload(imageFlie.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const newpromotion = {
      name,
      image: imageUrl,
      description,
      discount,
      startDate,
      endDate,
    };
    console.log(newpromotion);
    const createPromotion = await Promotion.create(newpromotion);
    if (createPromotion) {
      return res.status(201).json({
        status: 201,
        data: createPromotion,
      });
    } else {
      return res
        .status(400)
        .json({ status: 500, message: "Create promotion false" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updatePromotion = async (req, res) => {
  const promotionID = req.params.id;
  const { name, image, description, discount, startDate, endDate } = req.body;
  const imageFlie = req.file;
  const promotion = await Promotion.findByPk(promotionID);
  try {
    if (!promotion) {
      return res
        .status(400)
        .json({ status: 400, message: "Promotion not found" });
    }
    let imageUrl = promotion.image;
    if (imageFlie) {
      const result = await cloudinary.uploader.upload(imageFlie.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }
    const updatePromotion = {
      name,
      image: imageUrl,
      description,
      discount,
      startDate,
      endDate,
    };
    const Promotions = await Promotion.update(updatePromotion, {
      where: { id: promotionID },
    });
    if (Promotions) {
      return res.status(200).json({ status: 200, data: Promotions });
    } else {
      return res
        .status(400)
        .json({ status: 500, message: "Updaate promotion false" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deletePromotion = async (req, res) => {
  const promotionID = req.params.id;
  const promotion = Promotion.findByPk(promotionID);
  if (!promotion) {
    return res.status(404).json({ status: 404, message: "Category not found" });
  }
  const deletePromotion = await promotion.destroy();
  if (deletePromotion) {
    return res.status(200).json({ status: 200, message: "Delete successfuly" });
  } else {
    return res
      .status(500)
      .json({ status: 500, message: "Error connecting to database" });
  }
};
