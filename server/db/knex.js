//DB接続用

const knex = require("knex");
const knexConfig = require("../knexfile");

let currentConfig;
if (process.env.NODE_ENV === "production") {
  currentConfig = knexConfig.production;
} else if (process.env.NODE_ENV === "development") {
  currentConfig = knexConfig.development;
}

module.exports = knex(currentConfig);
