import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const SideBar = ({sidebarOpen, setSidebarOpen}) => {
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
            <Link
              to="/chat/12"
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors cursor-pointer 
               hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            >
              <img
                src="https://cdn.pixabay.com/photo/2023/12/04/17/16/woman-8429860_1280.jpg"
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Jane Doe</p>
                <span className="text-xs dark:text-gray-400">Chat</span>
              </div>
            </Link>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar
