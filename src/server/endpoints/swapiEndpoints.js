const fetch = require("node-fetch");

const applySwapiEndpoints = (server, app) => {
  const options = {
    method: "GET",
  };
  server.get("/hfswapi/test", async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      "https://swapi.dev/api/",
      "GET",
      null,
      true
    );
    res.send(data);
  });

  server.get("/hfswapi/getPeople/:id", async (req, res) => {
    const id = req.params.id;
    const data = await app.db.swPeople.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      const response = await fetch(
        `https://swapi.dev/api/people/${id}`,
        options
      );
      const { name, height, mass, homeworld } = await response.json();
      const homeworldRequest = await fetch(homeworld, options);
      const { name: homeworld_name } = await homeworldRequest.json();
      res.send({
        name,
        mass,
        height,
        homeworld_name,
        homeworld_id: homeworld.replace("https://swapi.dev/api", ""),
      });
    }
  });

  server.get("/hfswapi/getPlanet/:id", async (req, res) => {
    const id = req.params.id;
    const data = await app.db.swPlanet.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      const response = await fetch(
        `https://swapi.dev/api/planets/${id}`,
        options
      );
      const { name, gravity } = await response.json();
      res.send({ name, gravity });
    }
  });

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res) => {
    const randomID = Math.floor(Math.random() * 60);
    const planet = await app.db.swPlanet.findByPk(randomID);
    const people = await app.db.swPeople.findByPk(randomID);
    if (planet && people) {
      const response = app.swapiFunctions.getWeightOnPlanet(
        people.mass,
        planet.gravity
      );
      res.send({ weight: response });
    } else {
      const responsePlanet = await fetch(
        `https://swapi.dev/api/planets/${randomID}`,
        options
      );
      const responsePeople = await fetch(
        `https://swapi.dev/api/people/${randomID}`,
        options
      );
      const { mass, homeworld } = await responsePeople.json();
      const { gravity } = await responsePlanet.json();
      const gravityNumber = app.swapiFunctions.getGravityNumber(gravity);
      const response = app.swapiFunctions.getWeightOnPlanet(
        mass,
        gravityNumber
      );
      if (homeworld.match(/\d/g).join("") === String(randomID)) {
        response.send({ error: "Error" });
        return;
      }
      res.send({ weight: response });
    }
  });

  server.get("/hfswapi/getLogs", async (req, res) => {
    const data = await app.db.logging.findAll();
    res.send(data);
  });
};

module.exports = applySwapiEndpoints;
