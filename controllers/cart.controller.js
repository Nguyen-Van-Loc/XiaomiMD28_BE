const {
  Cart,
  Product,
  Account,
  productcolor,
  ProductColorConfig,
} = require("../models");
exports.getCartByAccount = async (req, res) => {
  const AccountId = +req.params.AccountId;
  try {
    const account = Account.findByPk(AccountId);
    console.log("Account.........." + account);
    if (!account) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }
    console.log("chạy");
    const listCart = await Cart.findAll({
      where: { AccountId: AccountId },
      include: [{ model: Product }],
    });
    console.log("ok");
    let total_Price = 0;

    for (const cartItem of listCart) {
      const product = await Product.findByPk(cartItem.productId);
      total_Price += product.price * cartItem.quantity;
    }
    if (!listCart) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, data: { data: listCart, totalPrice: total_Price } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createCart = async (req, res) => {
  const {
    productId,
    AccountId,
    ProductColorId,
    quantity,
    ProductColorConfigId,
  } = req.body;
  console.log(req.body);
  try {
    let productColor = null;
    if (ProductColorId) {
      productColor = await productcolor.findByPk(ProductColorId);
      if (!productColor) {
        return res.status(404).json({
          status: 404,
          message: "productColor not found",
        });
      }
    }
    let productColorConfig = null;
    if (ProductColorId) {
      productColorConfig = await ProductColorConfig.findByPk(
        ProductColorConfigId
      );
      if (!productColor) {
        return res.status(404).json({
          status: 404,
          message: "productColor not found",
        });
      }
    }

    console.log("vào");
    const product = await Product.findByPk(productId);
    const account = await Account.findByPk(AccountId);
    console.log("Product.........." + product);
    console.log("Product Color Id........." + productColor);
    console.log("Account.........." + account);
    console.log("Product Color Config Id......." + productColorConfig);
    if (!product || !account) {
      return res.status(404).json({
        status: 404,
        message: "Product or Account not found",
      });
    }

    const cart = {
      productId,
      AccountId,
      quantity,
    };
    if (ProductColorId) {
      cart.ProductColorId = ProductColorId;
    }
    if (ProductColorConfigId) {
      cart.ProductColorConfigId = ProductColorConfigId;
    }
    const createCart = await Cart.create(cart);
    if (!createCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({
      status: 201,
      data: createCart,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateCart = async (req, res) => {
  const id = req.params.id;
  const { productId, AccountId, ProductColorId, quantity } = req.body;
  try {
    const checkId = await Cart.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }
    const cart = { productId, AccountId, ProductColorId, quantity };
    const updateCart = await Cart.update(cart, { where: { id: id } });
    if (!updateCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  const id = req.params.id;
  try {
    const checkId = await Cart.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }
    const deleteCart = await checkId.destroy();
    if (!deleteCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
