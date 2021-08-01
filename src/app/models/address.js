module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      description: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'addresses' },
  );

  Address.associate = ({ User }) => {
    Address.hasMany(User, { as: 'users', foreignKey: 'addressId' });
  };

  return Address;
};
