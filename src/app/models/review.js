module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      description: { type: DataTypes.STRING, allowNull: true },
      score: { type: DataTypes.INTEGER, allowNull: false },
      petWalkId: { type: DataTypes.INTEGER, allowNull: true },
      ownerId: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'reviews' },
  );
  Review.associate = models => {
    Review.belongsTo(models.User, { as: 'reviewer', foreignKey: 'ownerId' });
    Review.belongsTo(models.PetWalk, { as: 'petWalk', foreignKey: 'petWalkId' });
  };

  return Review;
};
