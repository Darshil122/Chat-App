import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../features/chatSlice";
import { fetchMessages } from "../../features/messageSlice";

const ChatItem = ({ chat, currentUser, socket, onlineUsers, setSidebarOpen }) => {
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();
  const { chatName, isGroupChat, users } = chat;

  const otherUser =
    !isGroupChat && users?.find((u) => u._id !== currentUser?._id);

  const displayName = isGroupChat ? chatName : otherUser?.name;
  const displayPic = isGroupChat
    ? "https://static.vecteezy.com/ti/vetor-gratis/p1/24845472-conectados-comunidade-preto-glifo-ui-icone-social-meios-de-comunicacao-grupo-convite-trabalho-em-equipe-do-utilizador-interface-projeto-silhueta-simbolo-em-branco-espaco-solido-pictograma-para-rede-movel-isolado-ilustracao-vetor.jpg"
    : otherUser?.pic || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const handleChatClick = () => {
    dispatch(setSelectedChat(chat));
    dispatch(fetchMessages(chat._id));
    socket?.emit("join chat", chat._id);

    if(window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket]);


  const message = chat?.latestMessage?.content;
  const senderName = chat?.latestMessage?.sender?.name;
  const isOnline = !isGroupChat && onlineUsers.includes(otherUser?._id);


  return (
    <div
      key={chat._id}
      onClick={handleChatClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
    >
      <div className="relative">
        <img src={displayPic} className="w-10 h-10 rounded-full object-cover" />
        {!isGroupChat && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        )}
      </div>

      <div>
        <p className="font-semibold">{displayName}</p>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
          {message
            ? isGroupChat
              ? `${senderName || ""}: ${
                  message.length > 35
                    ? message.substring(0, 25) + "..."
                    : message
                }`
              : message.length > 25
              ? message.substring(0, 25) + "..."
              : message
            : isGroupChat
            ? "Group created"
            : "Start a conversation"}
        </span>
        {isTyping && <p className="text-sm text-gray-400 italic">Typing...</p>}
      </div>
    </div>
  );
};

export default ChatItem;
