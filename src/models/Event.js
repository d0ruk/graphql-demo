import Sequelize, { Model } from "sequelize";

export default class Event extends Model {
  static init(db) {
    return super.init(
      columns, // eslint-disable-line
      {
        sequelize: db,
      }
    );
  }

  static associate(models) {
    const opts = {
      through: "Attendance",
      as: "People",
      onDelete: "CASCADE",
    };

    this.belongsToMany(models.User, opts);
    this.belongsTo(models.User, { as: "owner" });
  }
}

const columns = {
  id: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Event name cannot be empty",
      },
    },
  },
  date: Sequelize.DATE,
  country: Sequelize.STRING(2),
  city: Sequelize.STRING,
  description: Sequelize.TEXT,
};
