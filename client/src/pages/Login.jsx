import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/me", { withCredentials: true });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      await axios.post("/api/login", form);
      await fetchUser();
      alert("ログインしました");
      nav(`/home`);
    } catch (error) {
      // サーバーからのエラーメッセージを参照
      if (error.response) {
        if (error.response.status === 404) {
          alert("ユーザーが見つかりません");
        } else if (error.response.status === 401) {
          alert("パスワードが間違っています");
        } else {
          alert("ログイン失敗");
        }
      } else {
        alert("通信エラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Navvy</h1>
      <div>
        <input
          placeholder="ユーザー名"
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          disabled={form.userName === "" || form.password === ""}
          onClick={login}
        >
          ログイン
        </button>
      </div>
    </div>
  );
};
