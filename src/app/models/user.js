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
      // Check if there is any way to avoid defining this addressId here
      addressId: { type: DataTypes.INTEGER, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'users' },
  );

  User.associate = ({ Address, Pet, Range }) => {
    User.hasOne(Address, { foreignKey: 'addressId' });
    User.hasMany(Pet);
    User.hasMany(Range);
  };
  return User;
};
