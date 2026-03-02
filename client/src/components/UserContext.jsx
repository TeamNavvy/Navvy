import { createContext, useContext, useState } from "react";

// Context生成
const UserContext = createContext();

// Providerコンポーネント
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user情報を保持

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Contextを簡単に使うためのフック
export const useUser = () => useContext(UserContext);
