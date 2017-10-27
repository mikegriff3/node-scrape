const Sequelize = require("sequelize");

const db = new Sequelize(
  "postgres://pobqcgzl:QyH6LesbNWcahvcT4l-rmgq2YJM1FykF@pellefant.db.elephantsql.com:5432/pobqcgzl",
  {
    dialect: "postgres",
    pool: {
      max: 3,
      min: 0,
      idle: 20000,
      acquire: 20000,
      evict: 20000
    }
  }
);

console.log("connected to remote db");

module.exports = db;
