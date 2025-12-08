import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUserToGroup, removeUserFromGroup } from "../features/chatSlice";

const GroupProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedChat } = useSelector((state) => state.chats);
  const { userProfile: user } = useSelector((state) => state.user);

  if (!selectedChat) return <p className="p-5">Loading...</p>;

  const isAdmin = selectedChat.groupAdmin._id === user._id;

  return (
    <div className="h-screen bg-gray-800 overflow-hidden pt-16">
      <div className="max-w-lg mx-auto p-6 overflow-y-auto h-full">
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Group"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h2 className="text-2xl font-bold mt-3 text-white">
            {selectedChat.chatName}
          </h2>
          <p className="text-gray-50">Group Chat</p>
        </div>

        {/* Members */}
        <h3 className="font-semibold mt-6 text-white">Members</h3>
        <div className="space-y-3 mt-2 bg-gray-100 p-4 rounded-lg">
          {selectedChat.users.map((u) => (
            <div key={u._id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={u.pic} className="w-10 h-10 rounded-full" />
                <div>
                  <p>{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                  {selectedChat.groupAdmin === u._id && (
                    <p className="text-blue-600 text-xs font-bold">Admin</p>
                  )}
                </div>
              </div>

              {/* Only Admin can remove */}
              {isAdmin && selectedChat.groupAdmin !== u._id && (
                <button
                  onClick={() =>
                    dispatch(removeUserFromGroup({ chatId: id, userId: u._id }))
                  }
                  className="text-red-500 text-sm cursor-pointer"
                >
                  remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Rename group (Admin only) */}
        {isAdmin && (
          <button
            className="mt-6 bg-blue-600 w-full text-white p-2 rounded-lg"
            onClick={() =>
              dispatch(updateGroup({ chatId: id, name: prompt("New name:") }))
            }
          >
            Rename Group
          </button>
        )}

        {/* Add user (Admin only) */}
        {isAdmin && (
          <button
            className="mt-3 bg-green-600 w-full text-white p-2 rounded-lg"
            onClick={() =>
              dispatch(
                addUserToGroup({
                  chatId: id,
                  email: prompt("Enter user email:"),
                })
              )
            }
          >
            Add Member
          </button>
        )}

        {/* Delete group (Admin only) */}
        {isAdmin && (
          <button
            className="mt-3 bg-red-600 w-full text-white p-2 rounded-lg"
            onClick={() => {
              if (confirm("Are you sure?")) dispatch(deleteGroup(id));
            }}
          >
            Delete Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupProfile;
