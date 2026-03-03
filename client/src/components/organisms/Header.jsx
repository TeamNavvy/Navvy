import axios from "axios";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Flex, Tooltip, Text } from "@chakra-ui/react";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { VscAccount } from "react-icons/vsc";

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
        <Heading size="lg" color="orange.500">
          Navvy
        </Heading>
      </Flex>
      <Flex align="center" fontSize="md" flexGrow={2} justify="flex-end">
        <Tooltip label="マイページ" placement="bottom">
          <Box
            cursor="pointer"
            onClick={onClickToMyPage}
            _hover={{ opacity: 0.8, transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            <VscAccount size={28} />
            <Text>マイページ</Text>
          </Box>
        </Tooltip>
        <PrimaryButton ml="6" size="sm" onClick={handleLogout}>
          ログアウト
        </PrimaryButton>
      </Flex>
    </Flex>
  );
};
