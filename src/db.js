import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    logging: !process.env.NO_LOG && process.env.NODE_ENV !== "production",
    define: {
      charset: "utf8",
      timestamps: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const MODELS = path.join(__dirname, "models");
fs.readdirSync(MODELS)
  .filter(str => !str.startsWith(".") && str.endsWith(".js"))
  .map(file => require(path.join(MODELS, file)).default.init(db))
  .map(model => "associate" in model && model.associate(db.models));

export default db;
