const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SIGN_PRIVATE = "xiaomimd28";

// Middleware xác thực API
const apiAuth = async (req, res, next) => {
  // Lấy token từ tiêu đề "Authorization" của yêu cầu
  let header_token = req.header("Authorization");

  if (!header_token) {
    return res.status(403).json({ status: 403, message: "unknown token" });
  }

  // Loại bỏ tiền tố "Bearer " để lấy token thô
  const token = header_token.replace("Bearer ", "");

  try {
    // Xác minh và giải mã token
    const data = jwt.verify(token, SIGN_PRIVATE);
    console.log("data ", data);

    // Tìm người dùng dựa trên dữ liệu từ token
    const user = await User.findOne({
      where: {
        id: data?.id,
      },
    });

    if (!user) {
      throw new Error("unknown user");
    }
    // Gắn thông tin người dùng và token vào yêu cầu
    req.user = user;
    req.data = data;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: 401, message: error.message });
  }
};

module.exports = {
  apiAuth,
};
