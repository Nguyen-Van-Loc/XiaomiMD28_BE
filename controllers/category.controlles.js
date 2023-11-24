const cloudinary = require("cloudinary").v2;
const { Category, Product } = require("../models");
const sequelize = require("sequelize");
exports.getCategory = async (req, res) => {
  const listCategory = await Category.findAll({
    include: [
      {
        model: Product,
        attributes: ["name"],
      },
    ],
    attributes: [
      "Category.id",
      "name",
      "image",
      [sequelize.fn("COUNT", sequelize.col("Products.id")), "productCount"],
    ],
    group: ["Category.id"],
  });
  if (listCategory) {
    res.status(200).json({ status: 200, data: listCategory });
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }
};
//get category theo id
exports.getCategoryId = async (req, res) => {
  console.log("hgvuahgdjbfmncahksdj");
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({ status: 404, message: "Nod found" });
  }
  const listCategory = await Category.findByPk(id);
  if (listCategory) {
    return res.status(200).json({ status: 200, data: listCategory });
  } else {
    return res
      .status(400)
      .json({ status: 400, message: "false connexting db" });
  }
};
//add category
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const filedata = req.file;

    if (!name || (!image && !filedata)) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    let imageUrl = "";
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }
    const whereName = Category.findOne({ where: { name } });
    if (whereName) {
      return res.status(400).json({
        status: 400,
        message: "Category with this name already exists",
      });
    }
    const category = { name, image: imageUrl };
    const addCategory = await Category.create(category);

    if (!addCategory) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: addCategory });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

//update category
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, image } = req.body;
  const filedata = req.file;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    let imageUrl = category.image;
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const update = { name, image: imageUrl };

    const updatedCategory = await Category.update(update, {
      where: { id: categoryId },
    });

    if (!updatedCategory) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    res.status(200).json({ status: 200, data: updatedCategory });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

//delete category
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res.status(404).json({ status: 404, message: "Category not found" });
  }
  const deleteCategory = await category.destroy();
  if (deleteCategory) {
    return res.status(200).json({ status: 200, message: "Delete successfuly" });
  } else {
    return res
      .status(500)
      .json({ status: 500, message: "Error connecting to database" });
  }
};
