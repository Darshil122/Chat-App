import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/2.png';

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
      <div className="text-xl font-bold">
        <img src={logo} alt="Logo" className="h-10 w-34" />
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
        />
        <span className="font-medium">{user ? user.name : "Guest"}</span>

        <Link to="/logout" className="font-medium">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
