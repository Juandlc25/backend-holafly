const fetch = require("node-fetch");

const applySwapiEndpoints = (server, app) => {
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
    const options = {
      method: "GET",
    };
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
    res.sendStatus(501);
  });

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res) => {
    res.sendStatus(501);
  });

  server.get("/hfswapi/getLogs", async (req, res) => {
    const data = await app.db.logging.findAll();
    res.send(data);
  });
};

module.exports = applySwapiEndpoints;
