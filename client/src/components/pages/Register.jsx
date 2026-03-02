import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadioButtonGroup } from "../molecules/RadioButtonGroup";

export const Register = () => {
  const [form, setForm] = useState({ userName: "", password: "", role: "" });
  const nav = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["親", "子供"];

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

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    const roleValue = e.target.value === "親" ? 1 : 0;
    setForm({ ...form, role: roleValue });
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
      <div>
        <RadioButtonGroup
          options={options}
          selectedOption={selectedOption}
          onChange={handleOptionChange}
        />
      </div>
      <button
        disabled={
          form.userName === "" || form.password === "" || form.role === ""
        }
        onClick={handleRegister}
      >
        登録
      </button>
    </>
  );
};
