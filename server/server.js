const express = require("express");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const knex = require("./db/knex");
const app = express();
const PORT = process.env.PORT || 3000;

// セッションの設定
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public"))); //pathはbuildコマンドによって変更可能性あり

app.get("/api", async (req, res) => {
  const result = await knex("users").select("*");
  res.send(result);
});

// ログイン処理
app.post("/api/login", async (req, res) => {
  const name = req.body.userName;
  const user_password = req.body.password;
  // まずユーザーが存在するか確認
  const user = await knex("users").where({ name }).first();

  if (!user) {
    // ユーザーが見つからない
    return res.status(404).json({ message: "ユーザーが見つかりません" });
  }

  const hashedInputPassword = crypto
    .createHash("sha256")
    .update(`${user.salt}${user_password}`)
    .digest("hex");

  if (user.password !== hashedInputPassword) {
    // パスワードが間違っている
    return res.status(401).json({ message: "パスワードが間違っています" });
  }

  // ログイン成功
  req.session.user = { id: user.id, name: name };
  return res.json({ message: "ログイン成功" });
});

// 認証チェック
app.get("/api/me", (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.status(401).json({ loggedIn: false });
});

// ログアウトの処理
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "ログアウトしました" });
  });
});

// 現在地をhistoryTBに格納;
app.post("/api/home", async (req, res) => {
  const { latitude, longitude, user, stay_start_time } = req.body;
  //   console.log("latitude:", latitude);
  // const longitude = req.body.currentPosition.longitude;

  const [location] = await knex("history")
    .insert({ user_id: user.id, latitude, longitude, stay_start_time })
    .returning("*");

  res.json(location);
});

// マイページ変更機能
app.patch("/api/myPage", async (req, res) => {
  const userId = req.session.user.id;
  const { name, image_url, password, myHome } = req.body;
  // 更新情報がない場合を除きたいので、updateDataで絞りこみ
  const updateData = {};

  if (name) updateData.name = name;
  if (image_url) updateData.image_url = image_url;
  if (password) {
    const salt = crypto.randomBytes(6).toString("hex");
    const saltAndPassword = `${salt}${password}`;
    const hash = crypto.createHash("sha256");
    const hashedPassword = hash.update(saltAndPassword).digest("hex");

    updateData.password = hashedPassword;
    updateData.salt = salt;
  }

  if (myHome) {
    await knex("home")
      .insert({ user_id: userId, longitude: myHome[0], latitude: myHome[1] })
      .onConflict("user_id")
      .merge({
        longitude: myHome[0],
        latitude: myHome[1],
      });
  }

  if (Object.keys(updateData).length > 0) {
    await knex("users").where({ id: userId }).update(updateData);
  }
  res.json({ message: "更新完了" });
});

app.get("/api/mypage/:id", async (req, res) => {
  const id = req.params.id;
  const result = await knex("users")
    .where({ id })
    .select("name", "image_url", "admin");
  res.send(result);
});

// ユーザー登録
app.post("/api/register", async (req, res) => {
  const { userName, password, role = 0 } = req.body;

  const salt = crypto.randomBytes(6).toString("hex");
  const saltAndPassword = `${salt}${password}`;
  const hash = crypto.createHash("sha256");
  const hashedPassword = hash.update(saltAndPassword).digest("hex");

  const existingUser = await knex("users").where({ name: userName }).first();

  if (existingUser) {
    return res.status(409).json({
      message: "そのユーザーはすでに使用されています",
    });
  }

  await knex("users").insert({
    name: userName,
    password: hashedPassword, //hash化
    salt: salt,
    admin: role,
  });

  return res.status(200).json({
    message: "ユーザー登録完了",
  });
});

// ユーザー検索機能(family登録用)
// todo：部分検索できると◎
app.get("/api/user/:name", async (req, res) => {
  const name = req.params.name;
  const result = await knex("users").where({ name: name }).select("*");
  res.send(result);
});

// family登録機能
app.post("/api/family/register/:name", async (req, res) => {
  const userId = req.session.user.id;
  const targetName = req.params.name;
  const target = await knex("users").where({ name: targetName }).first();
  await knex("family").insert({
    user_id: userId,
    family_id: target.id,
  });

  return res.status(200).json({
    message: "family登録完了",
  });
});

// 既存familyメンバー取得機能
app.get("/api/family/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const familyIds = (
    await knex("family").where({ user_id: userId }).select("family_id")
  ).map((el) => el.family_id);
  if (familyIds.length === 0) {
    return res.send([]);
  }

  const family = await knex("users")
    .whereIn("id", familyIds)
    .select("id", "name", "image_url");

  return res.send(family);
});

// ファミリー削除機能
app.delete("/api/family/:id", async (req, res) => {
  const userId = req.session.user.id;
  const targetId = Number(req.params.id);
  await knex("family").where({ user_id: userId, family_id: targetId }).del();
  return res.json({ message: "family削除完了" });
});

// status取得
app.get("/api/status/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await knex("user_status").where({ user_id: userId }).first();
    res.json(result || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "status取得エラー" });
  }
});

// status updateメソッド（データが無い1回目はinsertする）
app.post("/api/status", async (req, res) => {
  const { userId, status, comment } = req.body;
  try {
    const exist = await knex("user_status").where({ user_id: userId }).first();

    if (exist) {
      await knex("user_status")
        .where({ user_id: userId })
        .update({ status, comment, updated_at: knex.fn.now() });
    } else {
      await knex("user_status").insert({
        user_id: userId,
        status,
        comment,
        updated_at: knex.fn.now(),
      });
    }

    res.json({ message: "保存しました" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "status更新エラー" });
  }
});

// 家族取得
app.get("/api/family/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const family = await knex("family")
      .leftJoin("users", "family.family_id", "users.id")
      .select("users.id", "users.name")
      .where("family.user_id", userId);

    res.json(family);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "家族取得失敗" });
  }
});

//選択された家族の今日の足あと取得（全件取得）
app.get("/api/history/today/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await knex("history")
      .select("*")
      .where("user_id", userId)
      .andWhere("created_at", ">=", knex.raw("CURRENT_DATE"))
      .orderBy("created_at", "desc");

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "履歴取得エラー" });
  }
});

// ログインユーザアイコンURL取得
app.get("/api/icon/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await knex("users").where("id", userId).select("image_url");
    // console.log("iconurl", result);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "iconURL取得エラー" });
  }
});

// historyの最新のものを取得
app.get("/api/history/:id", async (req, res) => {
  const user_id = Number(req.params.id);

  const result = await knex("history")
    .where({ user_id })
    .orderBy("created_at", "desc")
    .first();

  return res.send(result);
});

// 既存familyメンバーの位置情報取得機能
app.get("/api/family-positions/:id", async (req, res) => {
  const id = Number(req.params.id);
  const familyPos = await knex("family")
    .where("family.user_id", id)
    .join("history", "family.family_id", "history.user_id")
    .leftJoin("user_status", "family.family_id", "user_status.user_id")
    .leftJoin("users", "family.family_id", "users.id")
    .distinctOn("history.user_id") // ユーザーごとに重複を排除
    .select(
      "history.user_id",
      "history.latitude",
      "history.longitude",
      "history.created_at",
      "user_status.status",
      "user_status.comment",
      "users.image_url",
    )
    .orderBy([
      { column: "history.user_id" },
      { column: "history.created_at", order: "desc" },
    ]);

  return res.send(familyPos);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
