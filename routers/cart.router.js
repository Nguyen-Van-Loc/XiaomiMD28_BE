const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.get(
  "/cart/:AccountId",

  cartController.getCartByAccount
);
router.post("/cart", cartController.createCart);
router.put("/cart/:id", cartController.updateCart);
router.delete("/cart/:id", cartController.deleteCart);
module.exports = router;
