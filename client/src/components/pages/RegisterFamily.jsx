import axios from "axios";
import { useState, useEffect } from "react";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { PrimaryInput } from "../atoms/PrimaryInput";
import { LuSearch } from "react-icons/lu";
import {
  Avatar,
  Divider,
  CardBody,
  CardHeader,
  Heading,
  Card,
  Text,
  Box,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

export const RegisterFamily = (props) => {
  const { searchWord, setSearchWord, user } = props;
  const [searchResult, setSearchResult] = useState([]);
  const [family, setFamily] = useState([]);

  const handleSearch = async () => {
    if (!searchWord) return;
    try {
      const response = await axios(`/api/user/${searchWord}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error("検索エラー", error);
      alert("検索に失敗");
    }
  };

  const handleGetFamily = async () => {
    try {
      const response = await axios(`/api/family/${user.id}`);
      setFamily(response.data);
    } catch (error) {
      console.error("取得エラー", error);
      alert("family取得に失敗");
    }
  };

  const handleAddFamily = async (targetName) => {
    try {
      await axios.post(`/api/family/register/${targetName}`);
      handleGetFamily();
      setSearchWord("");
      setSearchResult([]);
    } catch (error) {
      console.error("登録エラー", error);
      alert("family登録に失敗");
    }
  };

  const handleDeleteFamily = async (targetId) => {
    try {
      await axios.delete(`/api/family/${targetId}`);
      handleGetFamily();
    } catch (error) {
      console.error("削除エラー", error);
      alert("family削除に失敗");
    }
  };

  useEffect(() => {
    handleGetFamily();
  }, [user.id]);

  return (
    <>
      <Card maxW="xl" mx="auto" mt="10" mb="4" borderRadius="xl">
        <CardHeader>
          <Heading>ファミリー登録</Heading>
          <Box>
            <Text color="gray.500">ファミリーメンバー一覧</Text>
            {family.length === 0 ? (
              <Text color="red.400" fontSize="sm" textAlign="center">
                ファミリーの登録がありません
              </Text>
            ) : (
              family.map((member) => (
                <HStack key={member.id} justify="space-between" p="3">
                  <HStack spacing="4">
                    <Avatar
                      size="sm"
                      src={member.image_url || undefined}
                      name={member.name}
                    />
                    <Text>{member.name}</Text>
                  </HStack>

                  <PrimaryButton
                    size="sm"
                    bg="red.500"
                    onClick={() => handleDeleteFamily(member.id)}
                  >
                    ✕解除
                  </PrimaryButton>
                </HStack>
              ))
            )}
          </Box>
        </CardHeader>

        <Divider />

        <CardBody>
          <Text color="gray.500">新規追加</Text>
          <InputGroup>
            <PrimaryInput
              value={searchWord}
              placeholder="search"
              onChange={(e) => setSearchWord(e.target.value)}
            />

            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<LuSearch />}
                size="sm"
                variant="ghost"
                onClick={handleSearch}
              />
            </InputRightElement>
          </InputGroup>
          {/* 検索結果の表示 */}
          <div>
            {searchResult.length === 0 ? (
              <Text fontSize="sm" textAlign="center">
                該当ユーザーが存在しません
              </Text>
            ) : (
              searchResult.map((searchedUser) => (
                <HStack key={searchedUser.id} justify="space-between" p="3">
                  <HStack spacing={4}>
                    <Avatar
                      size="sm"
                      src={searchedUser.image_url || undefined}
                      name={searchedUser.name}
                    />
                    <Text>{searchedUser.name}</Text>
                  </HStack>
                  {!family.some((member) => member.id === searchedUser.id) && (
                    <PrimaryButton
                      size="sm"
                      bg="green.500"
                      onClick={() => handleAddFamily(searchedUser.name)}
                    >
                      ＋追加
                    </PrimaryButton>
                  )}
                </HStack>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};
