const {
  Orders,
  Account,
  Address,
  Pay,
  Product,
  Promotion,
  productcolor,
  ProductColorConfig,
} = require("../models");

exports.getListOrder = async (req, res) => {
  try {
    const listOrder = await Orders.findAll();
    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getListOrderInAccountAndStatus = async (req, res) => {
  const { AccountId, status } = req.params;
  console.log("AccountId:", AccountId);
  console.log("status:", status);
  try {
    const listOrder = Orders.findAll({
      where: { AccountId: AccountId, status: status },
    });
    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "fail connecting database" });
    }
    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  const {
    message,
    status,
    AccountId,
    AddressId,
    PayId,
    quantity,
    PromotionId,
    productId,
    ProductColorId,
    ProductColorConfigId,
  } = req.body;
  const date = new Date();

  try {
    const account = await Account.findByPk(AccountId);
    const address = await Address.findByPk(AddressId);
    const pay = await Pay.findByPk(PayId);
    const promotion = await Promotion.findByPk(PromotionId);
    const product = await Product.findByPk(productId);
    const productColor = await productcolor.findByPk(ProductColorId);
    const productColorConfig = await ProductColorConfig.findByPk(
      ProductColorConfigId
    );
    let totalPrice = 0;
    console.log(
      productColorConfig.price * quantity * (1 - promotion.discount / 100)
    );
    if (!account || !address || !pay || !product) {
      return res.status(404).json({
        status: 404,
        message:
          "Account or Address or Pay or Product or productColor or productColorConfig  not found",
      });
    }

    if (ProductColorId && ProductColorConfigId) {
      if (!productColor || !productColorConfig) {
        return res.status(404).json({
          status: 404,
          message: " productColor or productColorConfig  not found",
        });
      }
      if (PromotionId) {
        if (!promotion) {
          return res.status(404).json({
            status: 404,
            message: "Promotion not found",
          });
        }
        if (promotion.endDate > date) {
          return res.status(400).json({
            status: 400,
            message: "Promotion expired",
          });
        }
        totalPrice +=
          productColorConfig.price * quantity * (1 - promotion.discount / 100);
      } else {
        totalPrice += productColorConfig.price * quantity;
      }
    } else {
      if (PromotionId) {
        if (!promotion) {
          return res.status(404).json({
            status: 404,
            message: "Promotion not found",
          });
        }
        if (promotion.endDate > date) {
          return res.status(400).json({
            status: 400,
            message: "Promotion expired",
          });
        }
        totalPrice += product.price * quantity * (1 - promotion.discount / 100);
      } else {
        totalPrice += product.price * quantity;
      }
    }
    console.log("Final Total: ", totalPrice);
    const order = {
      message,
      status: 1,
      AccountId,
      AddressId,
      PayId,
      quantity,
      productId,
      total: totalPrice,
      ProductColorId,
      ProductColorConfigId,
    };

    const createOrder = await Orders.create(order);
    if (!createOrder) {
      return res.status(400).json({
        status: 400,
        message: "fail connecting database",
      });
    }
    return res.status(201).json({ status: 201, data: createOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const whereId = await Orders.findByPk(id);
    if (!whereId) {
      return res.status(404).json({ status: 404, message: "Order not found" });
    }
    const updateOrder = await Orders.update(status);
    if (!updateOrder) {
      return res
        .status(500)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
