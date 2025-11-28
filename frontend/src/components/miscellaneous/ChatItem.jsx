import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../features/chatSlice";
import { fetchMessages } from "../../features/messageSlice";

const ChatItem = ({ chat, currentUser, socket }) => {
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
  };

  return (
    <div
      key={chat._id}
      onClick={handleChatClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
    >
      <img
        src={displayPic}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{displayName}</p>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
          {chat.latestMessage
            ? isGroupChat
              ? //group chat
                `${chat.latestMessage.sender?.name}: ${
                  chat.latestMessage.content.length > 25
                    ? chat.latestMessage.content.substring(0, 25) + "..."
                    : chat.latestMessage.content
                }`
              : // private chat
              chat.latestMessage.content.length > 25
              ? chat.latestMessage.content.substring(0, 25) + "..."
              : chat.latestMessage.content
            : // No messages yet
            isGroupChat
            ? "Group created"
            : "Start a conversation"}
        </span>
      </div>
    </div>
  );
};

export default ChatItem;
