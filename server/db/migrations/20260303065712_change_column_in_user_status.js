/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("user_status", (t) => {
    t.dropColumn("emotion");
    t.string("status", 10);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("user_status", (t) => {
    t.string("emotion", 10);
    t.dropColumn("status");
  });
};
