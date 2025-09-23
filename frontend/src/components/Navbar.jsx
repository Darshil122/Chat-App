import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:8000/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <nav className="bg-emerald-200 p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Chat App</div>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          {user ? user.name : "Guest"}
        </span>

        {token && (
          <>
            <Link to="/profile" className="font-medium">
              Profile
            </Link>
            <Link to="/logout" className="font-medium">
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
