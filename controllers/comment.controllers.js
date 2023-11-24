const { Comment } = require("../models");

exports.getProductId = async (req, res) => {
  const ProductId = +req.params.ProductId;
  try {
    if (!ProductId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
      });
    }
    const list = await Comment.findAll({ raw: true });
    console.log(list);
    const listcomment = await Comment.findAll({
      include: Invoice,
      where: { ProductId: ProductId },
      raw: true,
    });
    if (!listcomment) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }
    return res.status(200).json({ statu: 200, data: listcomment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createComment = async (req, res) => {
  const { ProductId, AccountId, commentBody, image, star } = req.body;
  console.log(req.body);
  try {
    if (!commentBody) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    if (!ProductId || !AccountId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
      });
    }
    const comment = { ProductId, userId, commentBody, image, star };
    const addComment = await Comment.create(comment);
    if (!addComment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }

    return res.status(201).json({ status: 201, data: addComment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateComment = async (req, res) => {
  const id = req.params.id;
  const { ProductId, userId, commentBody } = req.body;
  try {
    if (!ProductId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
      });
    }
    const category = await Comment.findByPk(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }
    const comment = { ProductId, userId, commentBody };
    const updateComment = await Comment.update(comment, { where: { id: id } });
    if (!updateComment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: updateComment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteComment = await Comment.findByPk(id);
    if (!deleteComment) {
      return res.status(404).json({
        status: 404,
        message: "Id not fount",
      });
    }
    const comment = deleteComment.destroy();
    if (!comment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
