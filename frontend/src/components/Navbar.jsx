import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className="bg-green-300 px-4 py-2 shadow-md">
      <div className="flex justify-between items-center">

        <img src={logo} alt="Logo" className="h-14 w-auto" />

        <button
          className="lg:hidden text-gray-700 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <div className="hidden lg:flex items-center gap-4">
          <span className="font-medium">{user ? user.name : "Guest"}</span>
          <Link to="/logout" className="font-medium">
            Logout
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mt-4 lg:hidden flex flex-col gap-3">
          <span className="font-medium">{user ? user.name : "Guest"}</span>
          <Link to="/logout" className="font-medium">
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
