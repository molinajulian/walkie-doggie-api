module.exports = (sequelize, DataTypes) => {
  const PetWalk = sequelize.define(
    'PetWalk',
    {
      status: { type: DataTypes.STRING, allowNull: false },
      addressStartId: { type: DataTypes.INTEGER, allowNull: false },
      walkerId: { type: DataTypes.INTEGER, allowNull: true },
      startDate: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'pet_walks' },
  );
  PetWalk.associate = models => {
    PetWalk.belongsTo(models.Address, { as: 'addressStart', foreignKey: 'addressStartId' });
    PetWalk.belongsTo(models.User, { as: 'petWalker', foreignKey: 'walkerId' });
    PetWalk.hasMany(models.Reservation, { as: 'petWalkReservations', foreignKey: 'petWalkId' });
    PetWalk.hasMany(models.PetWalkInstruction, { as: 'petWalkInstructions', foreignKey: 'petWalkId' });
  };

  return PetWalk;
};
