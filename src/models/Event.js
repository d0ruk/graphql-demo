import Sequelize, { Model } from "sequelize";

const isProd = process.env.NODE_ENV === "production";

export default class Event extends Model {
  static init(db) {
    return super.init(
      columns, // eslint-disable-line
      {
        sequelize: db,
        hooks: {
          beforeCreate: Event.beforeCreate,
        },
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

  static beforeCreate(event) {
    if (!isProd) {
      // Date is a non-nullable field in the Event schema
      // since entering a correctly parsed date string
      // with only the graphiql hurts, fake it 'til u make it
      const { date } = require("faker");
      event.date = date.future().toDateString();
    }
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
