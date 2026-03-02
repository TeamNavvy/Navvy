import axios from "axios";
import { useEffect, useState } from "react";

export const Mypage = () => {
  // セッションのユーザー情報の取得
  // const { user, setUser } = useUser();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newMyHome, setNewMyHome] = useState("");

  const handleSubmit = async () => {
    try {
      const payload = {
        name: newName,
        icon: newIcon,
        password: newPassword,
        myHome: newMyHome,
      };
      console.log("payloadは", payload);
      const response = await axios.patch("/api/myPage", payload);
      console.log(response.data.message);
      alert(response.data.message);
    } catch (error) {
      console.error("エラー内容", error);
      alert("更新に失敗");
    }
  };

  return (
    <>
      <h1>マイページ</h1>

      <div>
        ユーザー名の変更
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        アイコンの変更
        <input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} />
      </div>
      <div>
        パスワードの変更
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        自宅の登録・変更
        <input
          value={newMyHome}
          onChange={(e) => setNewMyHome(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>変更を保存</button>
    </>
  );
};
