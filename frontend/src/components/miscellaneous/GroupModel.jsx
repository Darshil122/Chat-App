import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { searchUsers } from "../../features/userSlice";
import { createGroupChat } from "../../features/chatSlice";

const GroupModel = ({ handleClose }) => {
  const dispatch = useDispatch();

  // Users fetched from search
  const searchResults = useSelector((state) => state.user.searchResults || []);
  const userLoading = useSelector((state) => state.user.loading);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      dispatch(searchUsers(value));
    }
  };

  const handleAddUser = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  // ✅ create group
  const handleCreateGroup = () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.error("More than two users are required for the group chat");
      return;
    }

    // Prepare data
    const userIds = selectedUsers.map((u) => u._id);

    // Dispatch action
    dispatch(createGroupChat({ name: groupName, users: userIds }))
      .unwrap()
      .then(() => {
        toast.success("Group created successfully!");
        setGroupName("");
        setSelectedUsers([]);
        handleClose();
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to create group");
      });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="dark:bg-gray-800 bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Create Group Chat
        </h2>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white outline-none"
        />

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="bg-blue-100 text-black px-2 rounded-2xl flex items-center gap-1 text-sm"
            >
              {u.name}
              <button
                onClick={() => handleRemoveUser(u._id)}
                className="text-red-500 ml-1 cursor-pointer text-2xl"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* User Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white outline-none"
          autoComplete="off"
        />

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto mb-3">
          {searchTerm.trim() ? (
            <div className="space-y-2">
              {userLoading ? (
                <p className="text-gray-500">Searching...</p>
              ) : searchResults?.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <p className="font-semibold">{user.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No users found.</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Search users add to the group.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModel;
