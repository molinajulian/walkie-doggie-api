module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define(
    'Complaint',
    {
      description: { type: DataTypes.STRING, allowNull: false },
      userReporterId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, underscored: true, paranoid: false, tableName: 'complaints' },
  );
  Complaint.associate = models => {
    Complaint.belongsTo(models.User, { as: 'reporter', foreignKey: 'userReporterId' });
    Complaint.hasMany(models.ComplaintFile, { as: 'complaintFiles', foreignKey: 'complaintId' });
  };

  return Complaint;
};
