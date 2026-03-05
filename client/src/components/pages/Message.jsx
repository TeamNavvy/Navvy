import axios from "axios";
import { HeaderLayout } from "../templates/HeaderLayout";
import { useUser } from "../UserContext";
import { useEffect, useState } from "react";
import { Flex, Text, HStack, Avatar, VStack, Heading } from "@chakra-ui/react";
import { PrimaryButton } from "../atoms/PrimaryButton";

export const Message = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  // メッセージ取得の管理
  const handleGetMessage = async () => {
    try {
      const response = await axios(`/api/notifications/${user.id}`);
      const data = response.data;
      setMessages(data);
    } catch (err) {
      console.error("メッセージ表示のエラー", err);
    }
  };

  // 既読の管理
  const handleRead = async (messageId) => {
    try {
      const response = await axios.patch(
        `/api/notifications/${messageId}/read`,
      );
      handleGetMessage();
    } catch (err) {
      console.error("既読エラー", err);
    }
  };

  // 時間管理用
  const handleRelativeTime = (dateString) => {
    const now = new Date();
    const updated = new Date(dateString);

    const diffMs = now - updated;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "たった今";
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    return `${diffDays}日前`;
  };

  // メッセージ一覧取得
  useEffect(() => {
    handleGetMessage();
    // 1分ごとに実行
    const interval = setInterval(() => {
      handleGetMessage();
    }, 10 * 1000);
    // クリーンアップ関数
    return () => {
      clearInterval(interval);
    };
  }, [user.id]);

  return (
    <HeaderLayout>
      <Heading mt={6} color="gray">
        メッセージ一覧
      </Heading>
      <VStack mt={6}>
        {messages.length === 0 ? (
          <Text fontSize="sm" textAlign="center">
            メッセージなし
          </Text>
        ) : (
          messages.map((message) => (
            <HStack
              key={message.id}
              justify="space-between"
              p="3"
              bg="white"
              w="full"
            >
              <HStack spacing={4}>
                <Avatar
                  size="sm"
                  src={message.sender_image || undefined}
                  name={message.sender_name}
                />
                <Text>
                  {message.sender_name}が
                  {message.type === "arrived_home" ? "家に到着" : "家を出発"}しました
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {handleRelativeTime(message.occurred_at)}
                </Text>
              </HStack>
              {message.is_read ? (
                ""
              ) : (
                <PrimaryButton onClick={() => handleRead(message.id)}>
                  既読
                </PrimaryButton>
              )}
            </HStack>
          ))
        )}
      </VStack>
    </HeaderLayout>
  );
};
