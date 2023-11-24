const { Config } = require("../models");

exports.getConfig = async (req, res) => {
  try {
    const listConfig = await Config.findAll();
    if (!listConfig) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    return res.status(200).json({ status: 200, data: listConfig });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createConfig = async (req, res) => {
  const { name } = req.body; // Destructure 'name' from req.body
  try {
    if (!name) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    const whereName = await Config.findOne({ where: { name: name } });

    if (whereName) {
      // Change the condition to check if it already exists
      return res.status(400).json({
        status: 400,
        message: "Config already exists",
      });
    }

    const createConfig = await Config.create({ name: name }); // Pass an object with 'name' property
    if (!createConfig) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }

    return res.status(201).json({ status: 201, data: createConfig });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteConfig = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteConfig = await Config.findByPk(id); // Add 'await' here
    if (!deleteConfig) {
      return res.status(404).json({ status: 404, message: "Config not found" });
    }
    const deleteResult = await deleteConfig.destroy(); // Use 'deleteConfig.destroy()'
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
