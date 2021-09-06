module.exports = (sequelize, DataTypes) => {
  const ComplaintFile = sequelize.define(
    'ComplaintFile',
    {
      fileUri: { type: DataTypes.STRING, allowNull: false },
      complaintId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'complaint_files' },
  );
  ComplaintFile.associate = models => {
    ComplaintFile.belongsTo(models.Complaint, { as: 'complaint', foreignKey: 'complaintId' });
  };
  return ComplaintFile;
};
