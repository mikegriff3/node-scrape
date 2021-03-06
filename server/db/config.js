const Sequelize = require("sequelize");

const db = new Sequelize(
  "postgres://pobqcgzl:QyH6LesbNWcahvcT4l-rmgq2YJM1FykF@pellefant.db.elephantsql.com:5432/pobqcgzl",
  {
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000,
      evict: 20000
    }
  }
);

const dbmlb = new Sequelize(
  "postgres://xnhjfred:KDRE_hj2EWuckQOB5KQl5qW2LBTSjsE8@isilo.db.elephantsql.com:5432/xnhjfred",
  {
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000,
      evict: 20000
    }
  }
);

console.log("connected to remote db");

module.exports = { db, dbmlb };
