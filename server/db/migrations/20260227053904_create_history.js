/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = (knex) => {
  return knex.schema.createTable("history", (t) => {
    t.increments("id").primary();
    t.integer("user_id").notNullable();
    t.decimal("latitude", 10, 6).notNullable();
    t.decimal("longitude", 10, 6).notNullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.foreign("user_id").references("users.id").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = (knex) => {
  return knex.schema.dropTable("history");
};
