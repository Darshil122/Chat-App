import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../features/messageSlice";
import ScrollToBottom from "react-scroll-to-bottom";
import moment from "moment";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  let typingTimeout;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedChat } = useSelector((state) => state.chats);
  const { messages } = useSelector((state) => state.messages);
  const { userProfile } = useSelector((state) => state.user);

  //socket setup
  useEffect(() => {
    if (userProfile) {
      socket.emit("setup", userProfile);
    }
  }, [userProfile]);

  // Join chat when user selects one
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join chat", selectedChat._id);
      dispatch(fetchMessages(selectedChat._id));
    }
  }, [selectedChat, dispatch]);

  // recevied message
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      // Only add message if it belongs to currently opened chat
      if (selectedChat?._id === msg.chat._id) {
        dispatch({ type: "messages/addMessage", payload: msg });
      }
    };

    socket.on("message received", handleMessage);

    return () => {
      socket.off("message received", handleMessage);
    };
  }, [selectedChat, dispatch]);

  // online/offline events
  useEffect(() => {
    socket.on("user online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });
    return () => {
      socket.off("user online");
      socket.off("user offline");
    };
  }, []);

  // send message
  const handleSend = () => {
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ content: newMessage, chatId: selectedChat._id }))
      .unwrap()
      .then((msg) => {
        socket.emit("new message", msg);
      });

    setNewMessage("");
  };

  // typing indicator
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!typing){
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 1000);
  };

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  const chatUser =
    selectedChat &&
    !selectedChat.isGroupChat &&
    selectedChat.users.find((u) => u._id !== userProfile._id);

    const isOnline = onlineUsers.includes(chatUser?._id);

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Sidebar */}
      <SideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        socket={socket}
      />

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <header
          onClick={() =>
            selectedChat?.isGroupChat &&
            navigate(`/GroupProfile/${selectedChat._id}`)
          }
          className="p-4 bg-white dark:bg-gray-800 shadow flex items-center gap-3 cursor-pointer relative"
        >
          <button
            className="text-gray-800 dark:text-white text-xl lg:hidden absolute left-3 top-1/2 -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="flex items-center gap-3 mx-auto lg:mx-0">
            {selectedChat ? (
              <>
                {/* Avatar */}
                <img
                  src={
                    selectedChat.isGroupChat
                      ? "https://static.vecteezy.com/ti/vetor-gratis/p1/24845472-conectados-comunidade-preto-glifo-ui-icone-social-meios-de-comunicacao-grupo-convite-trabalho-em-equipe-do-utilizador-interface-projeto-silhueta-simbolo-em-branco-espaco-solido-pictograma-para-rede-movel-isolado-ilustracao-vetor.jpg"
                      : chatUser?.pic
                  }
                  className="w-10 h-10 object-cover rounded-full"
                  alt="chat icon"
                />

                {/* Name + Status */}
                <div className="flex flex-col leading-tight">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                    {selectedChat.isGroupChat
                      ? selectedChat.chatName
                      : chatUser?.name}
                  </h2>

                  {/* Status / Typing */}
                  {!selectedChat.isGroupChat && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {isTyping ? (
                        <span className="text-blue-500">typing...</span>
                      ) : isOnline ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        <span className="text-red-500">Offline</span>
                      )}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <h2 className="text-lg text-gray-600 dark:text-white">
                Start messaging...
              </h2>
            )}
          </div>
        </header>

        {/* Messages */}
        <ScrollToBottom className="scrollbar-hide flex-1 overflow-y-auto p-4">
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
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
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

        {/* Input */}
        {selectedChat && (
          <footer className="p-4 bg-white dark:bg-gray-800 flex gap-3 shadow-lg items-center">
            <input
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              onChange={typingHandler}
              placeholder="Type a message..."
              name="message"
              className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 shadow"
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-white text-lg"
              />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Chat;
