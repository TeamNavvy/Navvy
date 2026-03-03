import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { RegisterFamily } from "./registerFamily";
import { PrimaryInput } from "../atoms/PrimaryInput";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { FileInput } from "../atoms/FileInput";
import { FormField } from "../molecules/FormFiels";
import {
  Avatar,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Card,
  Text,
} from "@chakra-ui/react";
import { HeaderLayout } from "../templates/HeaderLayout";

export const Mypage = () => {
  // セッションのユーザー情報の取得
  const { user } = useUser();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newMyHome, setNewMyHome] = useState("");

  const [myInfo, setMyInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [searchWord, setSearchword] = useState("");

  const handleSubmit = async (imageUrl) => {
    try {
      let myHomePosition = null;
      if (newMyHome) {
        const response = await axios.get(
          `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${newMyHome}`,
        );
        // 住所が見つからない場合のエラーハンドリング
        if (!response.data || response.data.length === 0) {
          alert("住所が見つかりませんでした");
          return;
        }
        myHomePosition = response.data[0].geometry.coordinates;
      }
      //  変更内容だけをpayloadに入れたい
      const payload = {};
      if (newName) payload.name = newName;
      if (newPassword) payload.password = newPassword;
      if (myHomePosition) payload.myHome = myHomePosition;
      if (imageUrl) payload.image_url = imageUrl;
      console.log("payloadは", payload);

      if (Object.keys(payload).length > 0) {
        const response = await axios.patch("/api/myPage", payload);
        alert(response.data.message);
      } else {
        alert("変更内容がありません");
      }
    } catch (error) {
      console.error("エラー内容", error);
      alert("更新に失敗");
    }
  };

  // 既存の登録情報を参照
  useEffect(() => {
    fetch(`/api/mypage/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("myInfoの中身:", data[0]);
        setMyInfo(data[0]);
      });
  }, []);

  // アップロード
  const handleUpload = async () => {
    if (!newIcon) {
      await handleSubmit(null);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", newIcon);
    console.log("imageBBへのアップロード", formData);
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
      console.log("アップロードに失敗", error);
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderLayout>
      <Heading size="4xl">My Page</Heading>
      <Card maxW="xl" mx="auto" mt="10" mb="4" borderRadius="xl">
        <CardHeader>
          <Avatar size="xl" src={myInfo.image_url} />
          <Heading size="md">{myInfo.name}</Heading>
          <Text fontSize="sm" color="gray.500">
            プロフィール設定
          </Text>
        </CardHeader>

        <Divider />

        <CardBody>
          {myInfo.image_url && <img src={myInfo.image_url} />}

          <FormField label="ユーザー名の変更">
            <PrimaryInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </FormField>
          <FormField label="アイコンの変更">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setNewIcon(e.target.files[0])}
            />
          </FormField>
          <FormField label="パスワードの変更">
            <PrimaryInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>
          <FormField label="自宅の登録・変更">
            <PrimaryInput
              value={newMyHome}
              onChange={(e) => setNewMyHome(e.target.value)}
            />
          </FormField>
          <PrimaryButton mt="3" onClick={handleUpload} disabled={loading}>
            {loading ? "保存中・・・" : "変更を保存"}
          </PrimaryButton>
        </CardBody>
      </Card>
      {myInfo.admin === 1 ? (
        <RegisterFamily
          searchWord={searchWord}
          setSearchWord={setSearchword}
          user={user}
        />
      ) : (
        <div></div>
      )}
    </HeaderLayout>
  );
};
