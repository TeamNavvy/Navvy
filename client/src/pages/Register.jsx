import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [form, setForm] = useState({ userName: "", password: "" });
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "登録失敗");
        return;
      }
      alert(data.message || "登録成功");

      nav("/");
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <>
      <h3>新規登録</h3>
      <div>
        <label>ユーザー名：</label>
        <input
          placeholder="ユーザー名"
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />
      </div>
      <div>
        <label>パスワード：</label>
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <button
        disabled={form.userName === "" || form.password === ""}
        onClick={handleRegister}
      >
        登録
      </button>
    </>
  );
};
