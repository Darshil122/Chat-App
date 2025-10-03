import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState();

    useEffect(() => {
      const fetchUser = async () => {
        if (token) {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUser(res.data.user);
          } catch (error) {
            console.error("Failed to fetch user", error);
          }
        }
      };
      fetchUser();
    }, [token]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatState };
export default ChatProvider;