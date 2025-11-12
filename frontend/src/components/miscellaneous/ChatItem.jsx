import React from 'react'

const ChatItem = ({ chat, currentUser }) => {
  const {chatName, isGroupChat, users, latestMessage} = chat;
    const otherUser =
      !isGroupChat && users?.find((u) => u._id !== currentUser?._id);

      const displayName = isGroupChat
        ? chatName
        : otherUser?.name || "Unknown User";
      const displayPic = isGroupChat
        ? "https://static.vecteezy.com/ti/vetor-gratis/p1/24845472-conectados-comunidade-preto-glifo-ui-icone-social-meios-de-comunicacao-grupo-convite-trabalho-em-equipe-do-utilizador-interface-projeto-silhueta-simbolo-em-branco-espaco-solido-pictograma-para-rede-movel-isolado-ilustracao-vetor.jpg"
        : otherUser?.pic ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div
      key={chat._id}
      onClick={() => handleUserClick(chatUser?._id)}
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
          {isGroupChat ? "Group Chat" : "Direct Message"}
        </span>
      </div>
    </div>
  );
}

export default ChatItem
