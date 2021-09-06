module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      observations: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.STRING, allowNull: false },
      addressStartId: { type: DataTypes.INTEGER, allowNull: false },
      addressEndId: { type: DataTypes.INTEGER, allowNull: false },
      petId: { type: DataTypes.INTEGER, allowNull: true },
      rangeId: { type: DataTypes.INTEGER, allowNull: false },
      reservationDate: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      petWalkId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'reservations' },
  );
  Reservation.associate = models => {
    Reservation.belongsTo(models.Address, { as: 'addressStart', foreignKey: 'addressStartId' });
    Reservation.belongsTo(models.Address, { as: 'addressEnd', foreignKey: 'addressEndId' });
    Reservation.hasOne(models.Range, { as: 'reservationRange', foreignKey: 'rangeId' });
    Reservation.hasOne(models.Pet, { as: 'reservationPet', foreignKey: 'petId' });
    Reservation.belongsTo(models.PetWalk, { as: 'reservationPetWalk', foreignKey: 'petWalkId' });
  };

  return Reservation;
};
