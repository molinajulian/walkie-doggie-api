module.exports = (sequelize, DataTypes) => {
  const PetWalkInstruction = sequelize.define(
    'PetWalkInstruction',
    {
      instruction: { type: DataTypes.STRING, allowNull: false },
      petWalkId: { type: DataTypes.INTEGER, allowNull: false },
      petId: { type: DataTypes.INTEGER, allowNull: true },
      addressLatitude: { type: DataTypes.STRING, allowNull: false },
      addressLongitude: { type: DataTypes.STRING, allowNull: false },
      addressDescription: { type: DataTypes.STRING, allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'pet_walk_instructions' },
  );

  PetWalkInstruction.associate = ({ PetWalk, Pet }) => {
    PetWalkInstruction.belongsTo(Pet, { as: 'petWalkInstruction', foreignKey: 'petId' });
    PetWalkInstruction.belongsTo(PetWalk, { as: 'petWalk', foreignKey: 'petWalkId' });
  };
  return PetWalkInstruction;
};
