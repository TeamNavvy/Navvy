// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
