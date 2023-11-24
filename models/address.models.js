module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    nameReceiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneReceiver: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Address;
};
