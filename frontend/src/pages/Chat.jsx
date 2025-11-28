import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../features/messageSlice";
import ScrollToBottom from "react-scroll-to-bottom";
import moment from "moment";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

let socket;

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showGroupProfile, setShowGroupProfile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedChat } = useSelector((state) => state.chats);
  const { messages } = useSelector((state) => state.messages);
  const { userProfile } = useSelector((state) => state.user);

  // SOCKET SETUP
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    if (userProfile) {
      socket.emit("setup", userProfile);
    }
  }, [userProfile]);

  // JOIN CHAT ROOM WHEN CHAT SELECTED
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join chat", selectedChat._id);
      dispatch(fetchMessages(selectedChat._id));
    }
  }, [selectedChat, dispatch]);

  // LISTEN FOR MESSAGE FROM SOCKET
  useEffect(() => {
    socket.on("message received", (msg) => {
      dispatch({ type: "messages/addMessage", payload: msg });
    });
  }, []);

  // SEND MESSAGE
  const handleSend = () => {
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ content: newMessage, chatId: selectedChat._id }))
      .unwrap()
      .then((msg) => {
        socket.emit("new message", msg);
      });
    setNewMessage("");
  };

  // USER OR GROUP DISPLAY
  const chatUser =
    selectedChat &&
    !selectedChat.isGroupChat &&
    selectedChat.users.find((u) => u._id !== userProfile._id);

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Left Sidebar */}
      <SideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        socket={socket}
      />

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <header
          onClick={() =>
            selectedChat.isGroupChat && navigate(`/GroupProfile/${selectedChat._id}`)
          }
          className="p-4 bg-white dark:bg-gray-800 shadow flex items-center gap-3 cursor-pointer"
        >
          {selectedChat ? (
            <>
              <img
                src={
                  selectedChat.isGroupChat
                    ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    : chatUser?.pic
                }
                className="w-10 h-10 object-cover rounded-full"
                alt="chat icon"
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : chatUser?.name}
              </h2>
            </>
          ) : (
            <h2 className="text-lg text-gray-600 dark:text-white">
              Select a chat to start messaging
            </h2>
          )}
        </header>

        {/* Messages */}
        <ScrollToBottom className="flex-1 overflow-y-auto p-4">
          {messages?.map((msg) => {
            const isSender = msg.sender._id === userProfile._id;

            return (
              <div
                key={msg._id}
                className={`flex flex-col mb-3 ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                {selectedChat.isGroupChat && !isSender && (
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 mb-1">
                    {msg.sender.name}
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow 
                    ${
                      isSender
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                >
                  {msg.content}
                </div>

                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {moment(msg.createdAt).format("hh:mm A")}
                </span>
              </div>
            );
          })}
        </ScrollToBottom>

        {/* Message Input */}
        {selectedChat && (
          <footer className="p-4 bg-white dark:bg-gray-800 flex gap-2 shadow-lg">
            <input
              value={newMessage}
              id="message"
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              autoComplete="off"
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Chat;
