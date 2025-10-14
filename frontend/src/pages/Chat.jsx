import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../components/SideBar";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-md lg:hidden">
          <button
            className="text-gray-800 dark:text-white text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </header>

        <main className="overflow-auto">
          <div className="p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Area</h2>
            <p>Start chatting here...</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
