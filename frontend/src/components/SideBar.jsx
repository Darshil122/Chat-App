import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, userInfo } from "../features/userSlice";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const {
    userProfile: user,
    loading,
    searchResults,
  } = useSelector((state) => state.user || {});
  const [serachTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      // console.log("search term", value);
      dispatch(searchUsers(value));
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40  bg-white/20 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed z-50 top-18 left-0 w-64 h-full bg-gray-50 dark:bg-gray-800 transition-transform transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:block`}
      >
        <div className="px-4 py-6">
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex justify-end">
              <button
                type="button"
                title="Create New Group"
                className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faUserGroup} />
                <span className="font-medium">New Group</span>
              </button>
            </li>
            <li className="relative w-full" title="Search User to Chat">
              <input
                ref={inputRef}
                value={serachTerm}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search User..."
                id="search"
                name="search"
                className="w-full pr-10 px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-white placeholder:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                onClick={handleInputClick}
                icon={faMagnifyingGlass}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-text"
              />
            </li>
            {serachTerm.trim() !== "" ? (
              <div className="h-full">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && searchResults.length === 0 && (
                  <p className="text-gray-500">No users found.</p>
                )}
                {!loading && searchResults.length > 0 && (
                  <ul>
                    {searchResults.map((user) => (
                      <Link
                        to="/chat/12"
                        key={user._id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer 
                      hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        <img
                          src={user?.pic}
                          alt={user?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-md">{user?.name}</p>
                          <span className="text-sm dark:text-gray-400">
                            Chat
                          </span>
                        </div>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                to="/chat/12"
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer 
                      hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              >
                <img
                  src={user?.pic}
                  alt={user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-md">{user?.name}</p>
                  <span className="text-sm dark:text-gray-400">Chat</span>
                </div>
              </Link>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
