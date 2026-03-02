import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";

export const Mypage = () => {
  // セッションのユーザー情報の取得
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newMyHome, setNewMyHome] = useState("");

  const [myInfo, setMyInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSubmit = async (imageUrl) => {
    try {
      let myHomePosition = null;
      if (newMyHome) {
        const response = await axios.get(
          `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${newMyHome}`,
        );
        myHomePosition = response.data[0].geometry.coordinates;
      }
      const payload = {
        name: newName,
        password: newPassword,
        myHome: myHomePosition,
        image_url: imageUrl,
      };
      console.log("payloadは", payload);
      if (Object.keys(payload).length > 0) {
        const response = await axios.patch("/api/myPage", payload);
        console.log(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("エラー内容", error);
      alert("更新に失敗");
    }
  };

  useEffect(() => {
    fetch(`/api/mypage/${user.id}`)
      .then((res) => res.json())
      .then((data) => setMyInfo(data[0]));
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", newIcon);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        await handleSubmit(data.data.url);
      } else {
        alert("画像のアップロードに失敗しました");
      }
    } catch (error) {
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>マイページ</h1>
      {myInfo.image_url && <img src={myInfo.image_url} />}

      <div>
        ユーザー名の変更
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        アイコンの変更
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewIcon(e.target.files[0])}
        />
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
      <button onClick={handleUpload}>変更を保存</button>
    </>
  );
};
