import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { PrimaryInput } from "../atoms/PrimaryInput";
import { Flex, VStack, Heading, Link as ChakraLink } from "@chakra-ui/react";

export const Login = () => {
  const { setUser } = useUser();
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
      // alert("ログインしました");
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
    <Flex minH="100vh" align="center" justify="center">
      <VStack
        spacing={6}
        w="sm"
        p={8}
        bg="white"
        borderRadius="xl"
        boxShadow="md"
      >
        <Heading size="lg">Navvy</Heading>

        <VStack spacing={3}>
          <PrimaryInput
            placeholder="ユーザー名"
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
          <PrimaryInput
            placeholder="password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </VStack>

        <PrimaryButton
          w="full"
          disabled={form.userName === "" || form.password === ""}
          onClick={login}
        >
          {loading ? "ログイン中" : "ログイン"}
        </PrimaryButton>

        <Link to="/register">
          <ChakraLink as="span" color="blue.500" fontSize="sm">
            新規登録
          </ChakraLink>
        </Link>
      </VStack>
    </Flex>
  );
};
