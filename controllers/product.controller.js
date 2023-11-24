const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const {
  Product,
  productcolor,
  Color,
  Category,
  ProductColorConfig,
  Config,
} = require("../models");
exports.getProduct = async (req, res) => {
  try {
    const name = req.query.name;
    let listProduct;
    if (name) {
      listProduct = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`, // Using 'like' for a partial match
          },
        },
      });
    } else {
      listProduct = await Product.findAll();
    }

    if (listProduct) {
      return res.status(200).json({ status: 200, data: listProduct });
    } else {
      res.status(400).json({ status: 400, message: "false connexting db" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProductId = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if ID is provided
    if (!id) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }
    const product = await Product.findOne({
      where: { id: id },
      include: [
        {
          model: productcolor,
          as: "colorProducts",
          include: [
            {
              model: Color,
            },
            {
              model: ProductColorConfig,
              as: "colorConfigs",
              include: [
                {
                  model: Config, // Adjust this based on your actual association
                },
              ],
            },
          ],
        },
      ],
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }

    // Return the product data
    return res.status(200).json({ status: 200, data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getCategoryID = async (req, res) => {
  try {
    const categoryID = +req.params.CategoryId;
    console.log(categoryID);
    if (!categoryID) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }
    const product = await Product.findAll({
      where: { CategoryId: categoryID },
      raw: true,
    });
    console.log(product);
    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }
    return res.status(200).json({ status: 200, data: product });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const { name, price, description, CategoryId, images } = req.body;
    const fileData = req.files; // Use req.files for multiple files

    if (!name || !price || (!images && !fileData)) {
      // Handle other required fields

      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    const category = await Category.findByPk(CategoryId);

    if (!category) {
      return res.status(400).json({
        status: 400,
        message: "CategoryId is a required field",
      });
    }

    let imageUrl = "";
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }
    const product = {
      name,
      images: imageUrl, // Store multiple image URLs as a comma-separated string or an array in your database
      price,
      description,
      CategoryId,
    };

    const addProduct = await Product.create(product);

    if (!addProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to the database" });
    }

    return res.status(201).json({ status: 201, data: addProduct });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findByPk(productID);

    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }

    const deleteProduct = await product.destroy();

    if (!deleteProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "false connexting db" });
    }
    return res.status(200).json({ status: 200, message: "delete successfuly" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
