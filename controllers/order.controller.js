const { Orders, Account, Address, Pay, Cart, Promotion } = require("../models");

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

exports.createOrder = async (req, res) => {
  const { message, status, AccountId, AddressId, PayId, CartId, PromotionId } =
    req.body;
  const date = new Date();
  const order = {
    message,
    status: "Chờ Xử Lý",
    AccountId,
    AddressId,
    PayId,
    CartId,
    PromotionId,
    total,
  };
  try {
    const account = await Account.findByPk(AccountId);
    const address = await Address.findByPk(AddressId);
    const pay = await Pay.findByPk(PayId);
    const cart = await Cart.findByPk(CartId);
    const promotion = await Promotion.findByPk(PromotionId);
    if (!account || !address || !pay || !cart) {
      return res.status(404).json({
        status: 404,
        message: "Account or Address or Pay or Cart not found",
      });
    }
    if (PromotionId) {
      if (!promotion) {
        return res
          .status(404)
          .json({ status: 404, message: "Promotion not found" });
      }

      if (promotion.endDate < date) {
        return res
          .status(410)
          .json({ status: 410, message: "Promotion expired" });
      } else {
        order.total = cart.total_Price * (1 - promotion.discount / 100);
      }
    } else {
      order.total = cart.total_Price;
    }
    const createOrder = await Orders.create(order);
    if (!createOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
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