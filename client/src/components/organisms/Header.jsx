import axios from "axios";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Flex, Link } from "@chakra-ui/react";
import { PrimaryButton } from "../atoms/PrimaryButton";

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
        mr={8}
        _hover={{ cursor: "pointer" }}
        onClick={onClickToHome}
      >
        <Heading size="lg">Navvy</Heading>
      </Flex>
      <Flex align="center" fontSize="md" flexGrow={2}>
        <Box pr={4}>
          <Link onClick={onClickToMyPage}>マイページ</Link>
        </Box>
      </Flex>
      <Flex align="center" fontSize="sm">
        <PrimaryButton onClick={handleLogout}>ログアウト</PrimaryButton>
      </Flex>
    </Flex>
  );
};
