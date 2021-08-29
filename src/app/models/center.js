module.exports = (sequelize, DataTypes) => {
  const Center = sequelize.define(
    'Center',
    {
      description: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: false },
      addressId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'addresses', key: 'id' } },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'centers' },
  );
  Center.addScope('base', {
    include: [{ model: sequelize.models.Address, as: 'address' }],
  });
  Center.associate = models => {
    Center.belongsTo(models.Address, { as: 'address', foreignKey: 'addressId' });
  };

  return Center;
};
