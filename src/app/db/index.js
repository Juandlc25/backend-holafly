"use strict";

const Sequelize = require("sequelize");
const models = require("./models");
const log = require("sequelize-pretty-logger")();

let sequelize;

sequelize = new Sequelize("holafly", "root", "root", {
  logging: false,
  port: 3306,
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  operatorsAliases: false,
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
});

const db = {
  Sequelize,
  sequelize,
};

for (const modelInit of models) {
  const model = modelInit(db.sequelize, db.Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(function () {
    console.log("sucess");
  })
  .catch(function (error) {
    console.log("error: " + error);
  });

const initDB = async () => {
  await db.swPeople.sync({ force: true });
  await db.swPlanet.sync({ force: true });
  await db.logging.sync({ force: true });
};

const populateDB = async () => {
  await db.swPlanet.bulkCreate([
    {
      name: "Tatooine",
      gravity: 1.0,
    },
  ]);
  await db.swPeople.bulkCreate([
    {
      name: "Luke Skywalker",
      height: 172,
      mass: 77,
      homeworld_name: "Tatooine",
      homeworld_id: "/planets/1",
    },
  ]);
};

const deleteDB = async () => {
  await db.swPeople.drop();
  await db.swPlanet.drop();
  await db.logging.drop();
};

const watchDB = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true,
  });

  const people = await db.swPeople.findAll({
    raw: true,
  });

  console.log("============= swPlanet =============");
  console.table(planets);
  console.log("\n");
  console.log("============= swPeople =============");
  console.table(people);
};

db.initDB = initDB;
db.populateDB = populateDB;
db.watchDB = watchDB;
db.deleteDB = deleteDB;

module.exports = db;
