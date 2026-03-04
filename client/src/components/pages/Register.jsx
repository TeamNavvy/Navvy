import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadioButtonGroup } from "../molecules/RadioButtonGroup";
import { Heading, VStack, Flex } from "@chakra-ui/react";
import { PrimaryInput } from "../atoms/PrimaryInput";
import { PrimaryButton } from "../atoms/PrimaryButton";

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
    <Flex minH="100vh" align="center" justify="center">
      <VStack
        spacing={6}
        w="sm"
        p={8}
        bg="white"
        borderRadius="xl"
        boxShadow="md"
      >
        <Heading>新規登録</Heading>
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
        <VStack>
          <RadioButtonGroup
            options={options}
            selectedOption={selectedOption}
            onChange={handleOptionChange}
          />
        </VStack>
        <PrimaryButton
          w="full"
          disabled={
            form.userName === "" || form.password === "" || form.role === ""
          }
          onClick={handleRegister}
        >
          登録
        </PrimaryButton>
      </VStack>
    </Flex>
  );
};
