"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Note.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Note.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Catatan belum ditulis" },
          notNull: { msg: "Catatan belum ditulis" },
          len: {
            msg: "Maksimal 20 karakter",
            args: [1, 20],
          },
        },
      },
      isDone: DataTypes.BOOLEAN,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Note",
    }
  );

  Note.beforeCreate((note) => {
    note.isDone = false;
  });
  return Note;
};
