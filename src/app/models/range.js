module.exports = (sequelize, DataTypes) => {
  const Range = sequelize.define(
    'Range',
    {
      dayOfWeek: { type: DataTypes.STRING, allowNull: false },
      startAt: { type: DataTypes.TIME, allowNull: false },
      endAt: { type: DataTypes.TIME, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'ranges' },
  );

  Range.associate = ({ User }) => {
    Range.belongsTo(User, { as: 'user', foreignKey: 'walkerId' });
  };
  return Range;
};
