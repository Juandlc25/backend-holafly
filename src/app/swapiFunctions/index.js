const fetch = require("node-fetch");

const getWeightOnPlanet = (mass, gravity) => {
  return mass * gravity;
};

const getGravityNumber = (gravity) =>
  gravity === "unknown" ? 0 : gravity.match(/\d/g).join("");

const genericRequest = async (url, method, body, logging = false) => {
  let options = {
    method: method,
  };
  if (body) {
    options.body = body;
  }
  const response = await fetch(url, options);
  const data = await response.json();
  if (logging) {
    console.log(data);
  }
  return data;
};

module.exports = {
  getWeightOnPlanet,
  genericRequest,
  getGravityNumber,
};
