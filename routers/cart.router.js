const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.get(
  "/cart/:AccountId",
  authMidleWare.apiAuth,
  cartController.getCartByAccount
);
router.post("/cart", authMidleWare.apiAuth, cartController.createCart);
router.put("/cart/:id", authMidleWare.apiAuth, cartController.updateCart);
router.delete("/cart/:id", authMidleWare.apiAuth, cartController.deleteCart);
module.exports = router;
