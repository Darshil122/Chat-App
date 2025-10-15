import React from 'react'

const ChatItem = ({ chat }) => {
    const chatUser = !chat.isGroupChat
      ? chat.users.find((u) => u._id !== user?._id)
      : null;
  return (
    <div
      key={chat._id}
      onClick={() => handleUserClick(chatUser?._id)}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
    >
      <img
        src={chat.isGroupChat ? "/group.png" : chatUser?.pic}
        alt={chat.isGroupChat ? chat.chatName : chatUser?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">
          {chat.isGroupChat ? chat.chatName : chatUser?.name}
        </p>
        {chat.latestMessage && (
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
            {chat.latestMessage.content?.slice(0, 25) || "No messages yet"}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatItem
