/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([{ name: "", password: "", salt: "", message }]);
};

/**
 
@param { import("knex").Knex } knex
@returns { Promise<void> }*/
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex("users").del();
  await knex.raw('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');

  const crypto = require("crypto");
  const createUser = (name, plainPassword, admin) => {
    const salt = crypto.randomBytes(6).toString("hex");
    const hashedPassword = crypto
      .createHash("sha256")
      .update(`${salt}${plainPassword}`)
      .digest("hex");

    return {
      name,
      password: hashedPassword,
      salt,
      admin,
    };
  };

  await knex("users").insert([
    createUser("mother", "mother", 1),
    createUser("father", "father", 0),
    createUser("taro", "taro", 0),
    createUser("hanako", "hanako", 0),
  ]);
};
