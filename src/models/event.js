export default (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Event name cannot be empty"
        }
      }
    },
    date: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    description: DataTypes.TEXT
  });

  Event.associate = models => {
    const opts = {
      through: "attendance",
      as: "People"
    };

    Event.belongsToMany(models.user, opts);
  };

  return Event;
};