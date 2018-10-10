import Sequelize, { Model } from "sequelize";

export default class User extends Model {
  static init(db) {
    return super.init(
      columns, // eslint-disable-line
      {
        sequelize: db,
        hooks: {
          beforeCreate: User.beforeCreate
        }
      }
    );
  }

  static associate(models) {
    const opts = {
      through: "Attendance"
    };

    this.belongsToMany(models.Event, opts);
  }
}

const columns = {
  username: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        args: true,
        msg: "User name cannot be empty"
      }
    }
  },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: "That is not an e-mail address"
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [7, 42],
      notEmpty: {
        args: true,
        msg: "Password cannot be empty"
      }
    }
  },
  picture: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  bio: Sequelize.TEXT
};
