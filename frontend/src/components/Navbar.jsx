import axios from "axios";
import React, { useEffect, useState } from "react";

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
    <nav className="bg-emerald-200 p-4 flex justify-between">
      <div className="text-xl font-bold">Chat App</div>
      {user ? <h1>{user.name}</h1> : <h1>Guest</h1>}
    </nav>
  );
};

export default Navbar;
