import axios from "axios";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Flex, Tooltip, Text } from "@chakra-ui/react";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { VscAccount } from "react-icons/vsc";
import { CiMail } from "react-icons/ci";

export const Header = () => {
  const { user, setUser } = useUser();
  let navigate = useNavigate();

  const onClickToMyPage = () => {
    navigate("/myPage");
  };

  const onClickToHome = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    await axios.post("/api/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <Flex
      maxW="1280px"
      bg="yellow.200"
      color="black"
      align="center"
      justify="space-between"
      padding={{ base: 3, md: 5 }}
    >
      <Flex
        align="center"
        _hover={{ cursor: "pointer" }}
        onClick={onClickToHome}
        justify="center"
      >
        <Tooltip ml="20" label="ホーム画面" placement="bottom">
          <Heading size="lg" mr="10" color="orange.500">
            Navvy
          </Heading>
        </Tooltip>
      </Flex>

      <Flex align="center" gap={4}>
        <Text size="sm">{user.name}がログイン中</Text>
        <Tooltip ml="20" label="マイページ" placement="bottom">
          <Box
            cursor="pointer"
            onClick={onClickToMyPage}
            _hover={{ opacity: 0.8, transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            <VscAccount size={28} />
          </Box>
        </Tooltip>
        <Tooltip ml="20" label="メールBOX" placement="bottom">
          <Box
            cursor="pointer"
            onClick={onClickToMyPage}
            _hover={{ opacity: 0.8, transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            <CiMail size={28} />
          </Box>
        </Tooltip>
        <PrimaryButton size="sm" onClick={handleLogout}>
          ログアウト
        </PrimaryButton>
      </Flex>
    </Flex>
  );
};
