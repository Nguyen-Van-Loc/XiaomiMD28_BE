const express = require("express");
const app = express();
require("dotenv").config();
require("./untils/passport");

const bodyParser = require("body-parser");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const category = require("./routers/category.router");
const product = require("./routers/product.router");
const promotion = require("./routers/promotion.router");
const comment = require("./routers/comment.router");
const account = require("./routers/accounts.router");
const address = require("./routers/address.router");
const favorites = require("./routers/favorites.router");
const accounts_google = require("./routers/accounts_google.router");
const productView = require("./routers/productView.router");
const db = require("./models");
const { render } = require("ejs");
const PORT = process.env.POST || 3000;

app.set("view engine", "ejs");
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API XIAOMI_MD28_BE",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routers/*.js"],
};
const spacs = swaggerjsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));
app.use("/api", category);
app.use("/api", product);
app.use("/api", promotion);
app.use("/api", comment);
app.use("/api", account);
app.use("/api", accounts_google);
app.use("/api", address);
app.use("/api", favorites);

app.use("/products", productView);
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("server start loacalhost: " + PORT);
  });
});
