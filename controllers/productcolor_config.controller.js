const { ProductColorConfig, Config, productcolor } = require("../models");

exports.createProductColorConfig = async (req, res) => {
  const { quantity, configId, ProductColorId, price } = req.body;
  try {
    if (!quantity || !price) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    const config = await Config.findByPk(configId);
    const productColor = await productcolor.findByPk(ProductColorId);

    if (!config || !productColor) {
      return res
        .status(404)
        .json({ status: 404, message: "Config or Product Color not found" });
    }
    const createConfig = { quantity, configId, ProductColorId, price };
    const createProductColorConfig = await ProductColorConfig.create(
      createConfig
    );
    if (!createProductColorConfig) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to the database" });
    }
    return res
      .status(201)
      .json({ status: 201, data: createProductColorConfig });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProductColorConfig = async (req, res) => {
  const id = res.params.id;
  try {
    const whereProductColorConfig = ProductColorConfig.findByPk(id);
    if (!whereProductColorConfig) {
      return res
        .status(404)
        .json({ status: 404, message: "Product Color Config not found" });
    }
    const deleteProductColorConfig = await whereProductColorConfig.destroy();
    if (!deleteProductColorConfig) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to the database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
