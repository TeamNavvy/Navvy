/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = (knex) => {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("name", 20).notNullable().unique();
    t.string("password", 64).notNullable();
    t.string("salt", 20).notNullable();
    t.text("image_url");
    t.integer("status");
    t.text("message", 20);
    t.integer("admin");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
