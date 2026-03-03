import axios from "axios";
import { useState, useEffect } from "react";
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
      <h2>ファミリー登録</h2>
      <div>
        ファミリーメンバー
        {family.length === 0 ? (
          <p>familyの登録がありません</p>
        ) : (
          family.map((member) => (
            <div key={member.id}>
              {member.image_url && (
                <img src={member.image_url} alt={member.name} width={50} />
              )}
              <span>{member.name}</span>
              <button onClick={() => handleDeleteFamily(member.id)}>
                {" "}
                ✕解除
              </button>
            </div>
          ))
        )}
      </div>
      <input
        placeholder="search"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <button onClick={handleSearch}>検索</button>
      {/* 検索結果の表示 */}
      <div>
        {searchResult.length === 0 ? (
          <p>該当ユーザーが存在しません</p>
        ) : (
          searchResult.map((searchedUser) => (
            <div key={searchedUser.id}>
              {searchedUser.image_url && (
                <img
                  src={searchedUser.image_url}
                  alt={searchedUser.name}
                  width={50}
                />
              )}
              <span>{searchedUser.name}</span>
              {!family.some((member) => member.id === searchedUser.id) && (
                <button onClick={() => handleAddFamily(searchedUser.name)}>
                  ＋追加
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};
