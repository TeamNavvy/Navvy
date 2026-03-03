import axios from "axios";
import { useState } from "react";
export const RegisterFamily = (props) => {
  const { searchWord, setSearchWord } = props;
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async () => {
    if (!searchWord) return;
    try {
      const response = await axios(`/api/register/${searchWord}`);
      setSearchResult(response.data);
    } catch (err) {
      console.error("検索エラー", err);
      alert("検索に失敗");
    }
  };
  return (
    <>
      <h2>ファミリー登録</h2>
      <input
        placeholder="search"
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <button onClick={handleSearch}>検索</button>
      {/* 検索結果の表示 */}
      <div>
        {searchResult.length === 0 ? (
          <p>該当ユーザーが存在しません</p>
        ) : (
          searchResult.map((user) => (
            <div key={user.id}>
              {user.image_url && (
                <img src={user.image_url} alt={user.name} width={50} />
              )}
              <span>{user.name}</span>
              <button>＋追加</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
