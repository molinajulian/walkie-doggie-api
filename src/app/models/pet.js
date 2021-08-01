module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define(
    'Pet',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      birthYear: { type: DataTypes.INTEGER, allowNull: false },
      breed: { type: DataTypes.STRING, allowNull: false },
      gender: { type: DataTypes.STRING, allowNull: false },
      weight: { type: DataTypes.DOUBLE, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      photoUri: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'pets' },
  );

  Pet.associate = ({ User }) => {
    Pet.belongsTo(User, { foreignKey: 'ownerId' });
  };
  return Pet;
};
