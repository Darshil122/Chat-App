import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userInfo } from "../features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faCalendarDays,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile: user, loading } = useSelector(
    (state) => state.user || {}
  );
  
  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);
  
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full max-w-md p-6 relative transition-transform transform hover:scale-[1.01] duration-300">
        {/* Edit Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-500"
          title="Edit Profile"
          onClick={() => navigate("/editprofile")}
        >
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </button>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.pic}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          {/* <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {user.isAdmin ? "Administrator" : "Registered User"}
          </p> */}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
            <span>{user.email}</span>
          </div>

          {/* Username */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FontAwesomeIcon icon={faUser} className="text-green-500" />
            <span>Username: {user.name}</span>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-orange-500"
            />
            <span>
              Joined:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition" onClick={() => navigate("/editprofile")}>
            Edit Profile
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition" onClick={() => navigate("/chat")}>
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
