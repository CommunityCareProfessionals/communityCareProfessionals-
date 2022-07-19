const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserSkill extends Model {}

UserSkill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    skillcategory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'skillcategory',
        key: 'id',
        unique: false,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'userskill',
  }
);

module.exports = UserSkill;
