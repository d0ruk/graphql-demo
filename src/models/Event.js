import Sequelize, { Model } from "sequelize";

export default class Event extends Model {
  static init(db) {
    return super.init(
      columns, // eslint-disable-line
      {
        sequelize: db
      }
    );
  }

  static associate(models) {
    const opts = {
      through: "Attendance",
      as: "People",
      onDelete: "CASCADE"
    };

    this.belongsToMany(models.User, opts);
  }
}

const columns = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Event name cannot be empty"
      }
    }
  },
  date: Sequelize.DATE,
  country: Sequelize.STRING(2),
  city: Sequelize.STRING,
  description: Sequelize.TEXT
};
