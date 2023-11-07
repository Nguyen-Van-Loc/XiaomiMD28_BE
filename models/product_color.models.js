module.exports = (sequelize, DataTypes) => {
  const Product_Color = sequelize.define("Product_Color", {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Product_Color.associate = (models) => {
    Product_Color.belongsTo(models.Product, { foreignKey: "productId" });
    Product_Color.belongsTo(models.Color, { foreignKey: "colorId" });
  };

  return Product_Color;
};
