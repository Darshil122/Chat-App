import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { searchUsers, userInfo } from "../features/userSlice";
import { accessChat, fetchChat } from "../features/chatSlice";
import ChatItem from "./miscellaneous/ChatItem";
import { createSelector } from "@reduxjs/toolkit";

// ✅ Memoized selector (outside component)
const selectActiveChats = createSelector(
  (state) => state.chats,
  (chats) => chats?.filter((c) => c.isGroupChat) || []
);

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Redux state (memoized and stable)
  const user = useSelector((state) => state.user.userProfile, shallowEqual);
  const userLoading = useSelector((state) => state.user.loading);
  const searchResults = useSelector(
    (state) => state.user.searchResults,
    shallowEqual
  );
  const chats = useSelector((state) => state.chats, shallowEqual);
  // const chatError = useSelector((state) => state.chats.error);
  const activeChats = useSelector(selectActiveChats);

  // Fetch data on mount
  useEffect(() => {
    dispatch(userInfo());
    dispatch(fetchChat());
  }, [dispatch]);

  // Search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) dispatch(searchUsers(value));
  };

  // Start chat on user click
  const handleUserClick = (userId) => {
    dispatch(accessChat(userId));
    setSearchTerm("");
  };

  const handleInputClick = () => inputRef.current?.focus();

  // if (chatError)
  //   return <p className="text-center text-red-500 py-4">Error: {chatError}</p>;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-18 left-0 w-64 h-full bg-gray-50 dark:bg-gray-800 overflow-y-auto
        transition-transform transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:block shadow-md`}
      >
        <div className="px-4 py-6 space-y-4 text-sm font-medium">
          {/* Create Group Button */}
          <div className="flex justify-end">
            <button
              type="button"
              title="Create New Group"
              className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faUserGroup} />
              <span>New Group</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full" title="Search User to Chat">
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search User..."
              className="w-full pr-10 px-3 py-2 rounded-md dark:bg-gray-700 text-white placeholder:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <FontAwesomeIcon
              onClick={handleInputClick}
              icon={faMagnifyingGlass}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            />
          </div>

          {/* Conditional Rendering */}
          {searchTerm.trim() ? (
            <div className="space-y-2">
              {userLoading ? (
                <p className="text-gray-500">Searching...</p>
              ) : searchResults?.length > 0 ? (
                searchResults.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <img
                      src={u.pic}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <span className="text-xs dark:text-gray-400">Chat</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No users found.</p>
              )}
            </div>
          ) : (
            <>
              {/* Recent Chats */}
              <h2 className="text-gray-500 uppercase text-xs mt-4">
                Recent Chats
              </h2>

              {Array.isArray(chats) && chats.length > 0 ? (
                chats.map((chat) => (
                  <ChatItem key={chat._id || chat.id} chat={chat} />
                ))
              ) : (
                <p className="text-gray-500">No chats yet</p>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
