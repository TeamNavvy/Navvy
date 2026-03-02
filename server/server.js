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
      .where({ user_id: userId })
      .update({ latitude: myHome.latitude, longitude: myHome.longitude });
  }

  await knex("users").where({ id: userId }).update(updateData);
  res.json({ message: "更新完了" });
});

app.get("/api/mypage/:id", async (req, res) => {
  const id = req.params.id;
  const result = await knex("users")
    .where({ id })
    .select("name", "image_url", "status", "message", "admin");
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
