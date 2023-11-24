const cloudinary = require("cloudinary").v2;
const { productcolor, Color, Product } = require("../models");

exports.getProductColor = async (req, res) => {
  try {
    const listProductColor = await productcolor.findAll();
    if (!listProductColor) {
      return res.status(400).json({
        status: 400,
        message: "fail connecting database",
      });
    }
    return res.status(200).json({
      status: 200,
      data: listProductColor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createProductColor = async (req, res) => {
  const { productId, colorId, image } = req.body;
  const fileData = req.file;
  try {
    const product = await Product.findByPk(productId);
    const color = await Color.findByPk(colorId);
    console.log(product);
    console.log(color);
    if (!product || !color) {
      return res
        .status(404)
        .json({ status: 404, message: "Product or color not found" });
    }
    if (!image && !fileData) {
      if (fileData) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(fileData.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const productColor = { productId, colorId, image: imageUrl };
    const createProductColor = await productcolor.create(productColor);
    if (!createProductColor) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: productColor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProductColor = async (req, res) => {
  const id = req.params.id;
  try {
    const whereId = ProductColor.findByPk(id);

    if (!whereId) {
      return res
        .status(404)
        .json({ status: 404, message: "Product_Color not found" });
    }
    const deleteProductColor = await whereId.destroy();
    if (!deleteProductColor) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Delete Product_Color successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
