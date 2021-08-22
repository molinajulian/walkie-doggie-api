module.exports = (sequelize, DataTypes) => {
  const FirebaseToken = sequelize.define(
    'FirebaseToken',
    {
      token: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: false, underscored: true, paranoid: false, tableName: 'firebase_tokens' },
  );

  FirebaseToken.associate = ({ User }) => {
    FirebaseToken.belongsTo(User, { as: 'firebaseTokenUser', foreignKey: 'userId' });
  };

  return FirebaseToken;
};
