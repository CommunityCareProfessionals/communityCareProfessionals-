const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ServiceRequest extends Model {}

ServiceRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    date_requested: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'date service is needed',
    },
    service_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'date service was executed',
    },
    provider_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    consumer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    skillcategory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'skillcategory',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'servicerequest',
  }
);

module.exports = ServiceRequest;
