/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = (knex) => {
  return knex.schema.createTable("home", (t) => {
    t.integer("user_id").primary();
    t.decimal("latitude", 10, 6).notNullable();
    t.decimal("longitude", 10, 6).notNullable();
    t.foreign("user_id").references("users.id").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = (knex) => {
  return knex.schema.dropTable("home");
};
