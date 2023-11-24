const { Color } = require("../models");

exports.getColor = async (req, res) => {
  try {
    const listColor = await Color.findAll();
    if (!listColor) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: listColor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createColor = async (req, res) => {
  const color = req.body;
  try {
    const addColor = await Color.create(color);
    if (!addColor) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: addColor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteColor = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteColor = await Config.findByPk(id); // Add 'await' here
    if (!deleteColor) {
      return res.status(404).json({ status: 404, message: "Color not found" });
    }
    const deleteResult = await deleteColor.destroy(); // Use 'deleteConfig.destroy()'
    if (!deleteResult) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
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
