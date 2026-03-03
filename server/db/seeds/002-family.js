/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('TRUNCATE TABLE "family" RESTART IDENTITY CASCADE');

  await knex("family").insert([
    { user_id: 1, family_id: 2 }, // mother <-> father
    { user_id: 1, family_id: 3 }, // mother <-> taro
    { user_id: 1, family_id: 4 }, // mother <-> hanako
    { user_id: 2, family_id: 3 }, // father <-> taro
    { user_id: 2, family_id: 4 }, // father <-> hanako
  ]);
};
