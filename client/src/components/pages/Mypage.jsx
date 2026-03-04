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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { HeaderLayout } from "../templates/HeaderLayout";
import { useMessage } from "../../hooks/useMessage";

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

  // モーダル用ステート
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [modalMessage, setModalMessage] = useState("");

  const { showMessage } = useMessage();

  const handleSubmit = async (imageUrl) => {
    try {
      let myHomePosition = null;
      if (newMyHome) {
        const response = await axios.get(
          `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${newMyHome}`,
        );
        // 住所が見つからない場合のエラーハンドリング
        if (!response.data || response.data.length === 0) {
          showMessage({ title: "住所が見つかりませんでした", status: "error" });
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

      let timer;
      if (Object.keys(payload).length > 0) {
        const response = await axios.patch("/api/myPage", payload);
        console.log("PATCH 成功レスポンス:", response.data);

        setMyInfo((prev) => ({
          ...prev,
          ...(newName && { name: newName }),
          ...(imageUrl && { image_url: imageUrl }),
        }));
        setNewName("");
        setNewPassword("");
        setNewMyHome("");
        showMessage({ title: response.data.message, status: "success" });
      } else {
        showMessage({ title: "変更内容がありません", status: "error" });
      }
    } catch (error) {
      console.error("エラー内容", error);
      showMessage({ title: "更新に失敗", status: "error" });
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
        showMessage({
          title: "画像のアップロードに失敗しました",
          status: "error",
        });
      }
    } catch (error) {
      console.log("アップロードに失敗", error);
      showMessage({
        title: "通信エラーが発生しました",
        status: "error",
      });
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
          <FormField label="ユーザー名の変更">
            <PrimaryInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </FormField>
          <FormField label="アイコンの変更">
            <FileInput type="file" accept="image/*" onChange={setNewIcon} />
          </FormField>
          <FormField label="パスワードの変更">
            <PrimaryInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>
          <FormField label="自宅の登録・変更 (○○県○○市○○1-1-1のように番地まで入力)">
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
