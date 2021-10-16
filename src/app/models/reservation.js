module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      observations: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.STRING, allowNull: false },
      startHour: { type: DataTypes.STRING, allowNull: true, field: 'hour_start' },
      endHour: { type: DataTypes.STRING, allowNull: true, field: 'hour_end' },
      addressStartId: { type: DataTypes.INTEGER, allowNull: false },
      addressEndId: { type: DataTypes.INTEGER, allowNull: false },
      petId: { type: DataTypes.INTEGER, allowNull: true },
      reservationDate: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      petWalkId: { type: DataTypes.INTEGER, allowNull: true },
      walkerId: { type: DataTypes.INTEGER, allowNull: true },
      ownerId: { type: DataTypes.INTEGER, allowNull: true },
      duration: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'reservations' },
  );
  Reservation.associate = models => {
    Reservation.belongsTo(models.Address, { as: 'addressStart', foreignKey: 'addressStartId' });
    Reservation.belongsTo(models.Address, { as: 'addressEnd', foreignKey: 'addressEndId' });
    Reservation.belongsTo(models.Pet, { as: 'reservationPet', foreignKey: 'petId' });
    Reservation.belongsTo(models.PetWalk, { as: 'reservationPetWalk', foreignKey: 'petWalkId' });
    Reservation.belongsTo(models.User, { as: 'reservationWalker', foreignKey: 'walkerId' });
    Reservation.belongsTo(models.User, { as: 'reservationOwner', foreignKey: 'ownerId' });
  };

  return Reservation;
};
