/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = (knex) => {
  return knex.schema.createTable("family", (t) => {
    t.increments("id").primary();
    t.integer("user_id").notNullable();
    t.integer("family_id").notNullable();
    t.foreign("user_id").references("users.id").onDelete("CASCADE");
    t.foreign("family_id").references("users.id").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = (knex) => {
  return knex.schema.dropTable("family");
};
