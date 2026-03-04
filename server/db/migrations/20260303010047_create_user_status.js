/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_status", (t) => {
    t.increments("id").primary();
    t.integer("user_id").unsigned().notNullable();
    t.string("emotion", 10);
    t.text("comment");
    t.timestamp("updated_at").defaultTo(knex.fn.now());

    t.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_status");
};
