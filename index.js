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
const comment = require("./routers/comment.router")
const account = require("./routers/accounts.router");
const accounts_google = require("./routers/accounts_google.router");
const db = require("./models");
const PORT = process.env.POST || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('views'));


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
app.use("/api",comment)
app.use("/api", account);
app.use("/api", accounts_google);

app.get("/", function(req, res){
  res.render('login');
});
app.get("/homeTest", function(req, res){
  res.render('home');
});
app.get("/staffManagerTest", function(req, res){
  res.render('staffManager');
});
app.get("/updateStaffTest", function(req, res){
  res.render('updateStaff');
});
app.get("/passTest", function(req, res){
  res.render('reset-password');
});
app.get("/salesTest", function(req, res){
  res.render('salesReport');
});
app.get("/customerTest", function(req, res){
  res.render('customerManager');
});
app.get("/addCustomer", function(req, res){
  res.render('addCustomer');
});
app.get("/InternalManagement", function(req, res){
  res.render('InternalManagement');
});
app.get("/salaryStatement", function(req, res){
  res.render('salaryStatement');
});


db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("server start loacalhost: " + PORT);
  });
});
