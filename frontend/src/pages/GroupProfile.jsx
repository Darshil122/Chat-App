import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChat,
  addUserToGroup,
  removeUserFromGroup,
  renameGroup,
  setSelectedChat
} from "../features/chatSlice";

const GroupProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedChat, loading } = useSelector((state) => state.chats);
  const { userProfile: user } = useSelector((state) => state.user);

useEffect(() => {
  dispatch(fetchChat()).then((res) => {
    if (res.payload) {
      const found = res.payload.find((c) => c._id === id);
      if (found) dispatch(setSelectedChat(found));
    }
  });
}, [id, dispatch]);

  if (loading || !selectedChat)
    return <p className="p-5 text-white">Loading...</p>;

  const isAdmin = selectedChat.groupAdmin?._id === user._id;

  return (
    <div className="h-screen bg-[#0f172a] overflow-hidden pt-10">
      <div className="max-w-lg mx-auto p-6 h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Group"
            className="w-24 h-24 mx-auto rounded-full shadow-md"
          />
          <h2 className="text-3xl font-bold mt-3 text-white tracking-wide">
            {selectedChat.chatName}
          </h2>
          <p className="text-gray-400 text-sm">Group Information</p>
        </div>

        {/* Members List */}
        <h3 className="font-semibold text-white text-lg mb-3">
          Members ({selectedChat.users.length})
        </h3>

        <div className="bg-[#1e293b] rounded-xl shadow-lg p-4 divide-y divide-gray-700">
          {selectedChat.users.map((u) => {
            const adminId =
              typeof selectedChat.groupAdmin === "string"
                ? selectedChat.groupAdmin
                : selectedChat.groupAdmin?._id;

            return (
              <div
                key={u._id}
                className="flex justify-between items-center py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.pic}
                    className="w-11 h-11 rounded-full border border-gray-600"
                    alt={u.name}
                  />

                  <div>
                    <p className="font-medium text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>

                    {/* Admin Label */}
                    {adminId === u._id && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-900 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                {isAdmin && adminId !== u._id && (
                  <button
                    className="text-red-400 hover:text-red-500 transition text-sm font-medium"
                    onClick={() =>
                      dispatch(
                        removeUserFromGroup({ chatId: id, userId: u._id })
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        {isAdmin && (
          <>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 w-full text-white p-3 rounded-lg font-semibold shadow-lg transition"
              onClick={() =>
                dispatch(
                  renameGroup({
                    chatId: id,
                    chatName: prompt("Enter new group name:"),
                  })
                )
              }
            >
              Rename Group
            </button>

            <button
              className="mt-3 bg-green-600 hover:bg-green-700 w-full text-white p-3 rounded-lg font-semibold shadow-lg transition"
              onClick={() =>
                dispatch(
                  addUserToGroup({
                    chatId: id,
                    uname: prompt("Enter username:"),
                  })
                )
              }
            >
              Add Member
            </button>
          </>
        )}

        {/* Back to Chat */}
        <button
          className="mt-6 text-amber-400 underline hover:text-amber-300 transition w-full text-center"
          onClick={() => navigate("/chat")}
        >
          ← Back to Chat
        </button>
      </div>
    </div>
  );
};

export default GroupProfile;
