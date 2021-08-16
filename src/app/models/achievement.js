module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define(
    'Achievement',
    {
      description: { type: DataTypes.STRING, allowNull: false },
      walkerId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'achievements' },
  );

  Achievement.associate = ({ User }) => {
    Achievement.belongsTo(User, { as: 'userAchievement', foreignKey: 'walkerId' });
  };

  return Achievement;
};
