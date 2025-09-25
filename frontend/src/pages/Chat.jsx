import React, { useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUserGroup, faBars } from "@fortawesome/free-solid-svg-icons";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for small screens (overlay) */}
      <div
        className={`fixed inset-0 z-40 bg-white/20 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 w-64 h-full bg-gray-50 dark:bg-gray-800 transition-transform transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:block`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faUserGroup} />
                <span className="font-medium">New Group</span>
              </button>
            </li>
            <li>
              <input
                type="text"
                placeholder="Search User..."
                id="search"
                name="search"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-white placeholder:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </li>
            <li className="flex items-center px-4 py-2 dark:text-white rounded-lg  dark:hover:bg-gray-700 transition">
              <span className="ml-3">Dashboard</span>
            </li>
            {/* Add more items as needed */}
          </ul>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-md lg:hidden">
          {/* Font Awesome Hamburger Icon */}
          <button
            className="text-gray-800 dark:text-white text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Header Title */}
          {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Chat
          </h1> */}
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Area</h2>
          hello
        </main>
      </div>
    </div>
  );
};

export default Chat;
