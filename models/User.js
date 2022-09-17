"use strict";
const Constants = require('../constants');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        uuid: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        password:{ type: DataTypes.STRING,allowNull: true },
        phoneNumber:{ type: DataTypes.STRING, allowNull: true },
        status: {
          type:   Sequelize.INTEGER,
          defaultValue: 0 
        },
        properties:{ type: DataTypes.JSON, allowNull: true },
      },
      {
        paranoid: true,
        underscored: true,
        tableName: "users"
      }
    );

    User.associate = function(models) {
      // User.hasOne(models.UserProfile, { foreignKey: "user_id", onDelete: 'cascade' });
      // User.hasMany(models.UserRoles, { foreignKey: "user_id", onDelete: 'cascade' });
    };

    return User;
  };  