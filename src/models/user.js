export default (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "User name cannot be empty"
        }
      }
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "That is not an e-mail address"
        }
      }
    },
    picture: DataTypes.STRING,
    age: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    bio: DataTypes.TEXT
  });

  User.associate = models => {
    const opts = {
      through: "attendance",
    };

    User.belongsToMany(models.event, opts);
  };

  return User;
};
