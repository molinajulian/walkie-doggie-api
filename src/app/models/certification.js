module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define(
    'Certification',
    {
      description: { type: DataTypes.STRING, allowNull: false },
      walkerId: { type: DataTypes.INTEGER, allowNull: false },
      fileUri: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'certifications' },
  );

  Certification.associate = ({ User }) => {
    Certification.belongsTo(User, { as: 'certificationUser', foreignKey: 'walkerId' });
  };

  return Certification;
};
