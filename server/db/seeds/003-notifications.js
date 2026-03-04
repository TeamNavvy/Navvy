/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('TRUNCATE TABLE "notifications" RESTART IDENTITY CASCADE');

  const now = new Date();
  const minutesAgo = (m) => new Date(now - m * 60 * 1000);

  await knex("notifications").insert([
    // taro(id=3) が自宅到着 → 親のmother(1)に通知
    {
      sender_id: 3,
      receiver_id: 1,
      type: "arrived_home",
      occurred_at: minutesAgo(60),
      is_read: true, // 既読済みのパターン
    },

    // taro(id=3) が自宅出発 → 親のmother(1)に通知
    {
      sender_id: 3,
      receiver_id: 1,
      type: "left_home",
      occurred_at: minutesAgo(30),
      is_read: false,
    },

    // hanako(id=4) が自宅到着 → 親のmother(1)に通知
    {
      sender_id: 4,
      receiver_id: 1,
      type: "arrived_home",
      occurred_at: minutesAgo(10),
      is_read: false,
    },
  ]);
};
