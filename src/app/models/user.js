const { Pet } = require('./pet');
const { Address } = require('./address');
const { Range } = require('./range');
const { Achievement } = require('./achievement');
const { Certification } = require('./certification');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: true },
      lastLogin: { type: DataTypes.DATE, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: false },
      profilePhotoUri: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      score: { type: DataTypes.DOUBLE, allowNull: true },
      isPromoted: { type: DataTypes.BOOLEAN, allowNull: true },
      coverLetter: { type: DataTypes.STRING, allowNull: true },
      pricePerHour: { type: DataTypes.DOUBLE, allowNull: true },
      wasOnboarded: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      addressId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'addresses', key: 'id' } },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: false,
      tableName: 'users',
    },
  );
  User.addScope('complete', {
    include: [
      { model: sequelize.models.Address, as: 'address' },
      { model: sequelize.models.Pet, as: 'pets' },
      { model: sequelize.models.Range, as: 'ranges' },
      { model: sequelize.models.Certification, as: 'certifications' },
      { model: sequelize.models.Achievement, as: 'achievements' },
    ],
  });
  User.associate = models => {
    User.belongsTo(models.Address, { as: 'address', foreignKey: 'addressId' });
    User.hasMany(models.Pet, { as: 'pets', foreignKey: 'ownerId' });
    User.hasMany(models.Range, { as: 'ranges', foreignKey: 'walkerId' });
    User.hasMany(models.Certification, { as: 'certifications', foreignKey: 'walkerId' });
    User.hasMany(models.Achievement, { as: 'achievements', foreignKey: 'walkerId' });
  };
  return User;
};
