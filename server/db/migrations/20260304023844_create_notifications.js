/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table.integer("sender_id").notNullable();
    table.foreign("sender_id").references("users.id").onDelete("CASCADE");
    table.integer("receiver_id").notNullable();
    table.foreign("receiver_id").references("users.id").onDelete("CASCADE");
    table.timestamp("occurred_at").notNullable();
    table.boolean("is_read").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.string("type", 20).notNullable().defaultTo("arrived_home");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
