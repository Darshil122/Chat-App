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
import GroupModel from "./miscellaneous/GroupModel";


const SideBar = ({ sidebarOpen, setSidebarOpen, socket }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupModelOpen, setIsGroupModelOpen] = useState(false);

  const user = useSelector((state) => state.user.userProfile, shallowEqual);
 const { loading, searchResults, error } = useSelector(
   (state) => state.user,
   shallowEqual
 );

  const chats = useSelector((state) => state.chats.chats);

  useEffect(() => {
    dispatch(userInfo());
    dispatch(fetchChat());
  }, [dispatch]);

  const handleGroupModel = () => {
    setIsGroupModelOpen(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) dispatch(searchUsers(value));
  };

  const handleUserClick = (userId) => {
    dispatch(accessChat(userId));
    setSearchTerm("");
  };

  const handleInputClick = () => inputRef.current?.focus();


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
              onClick={handleGroupModel}
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
              id="text"
              placeholder="Search User name..."
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
              {loading ? (
                <p className="text-gray-400">Searching...</p>
              ) : error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : searchResults?.length > 0 ? (
                searchResults.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img src={u.pic} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      <span className="text-xs text-gray-400">Chat</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No users found</p>
              )}
            </div>
          ) : 
          (
          <>
            {/* Recent Chats */}
            <h2 className="text-gray-500 text-xs mt-4">Recent Chats</h2>

            {Array.isArray(chats) && chats.length > 0 ? (
              chats.map((chat) => (
                <ChatItem
                  key={chat._id || chat.id}
                  chat={chat}
                  currentUser={user}
                  socket={socket}
                  setSidebarOpen={setSidebarOpen}
                />
              ))
            ) : (
              <p className="text-gray-500">No chats yet</p>
            )}
          </>
          )}
        </div>
      </aside>

      {/* Group Modal */}
      {isGroupModelOpen && (
        <GroupModel handleClose={() => setIsGroupModelOpen(false)} />
      )}
    </>
  );
};

export default SideBar;
