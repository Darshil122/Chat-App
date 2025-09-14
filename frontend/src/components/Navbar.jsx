import axios from "axios";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const res = await axios.get("http://localhost:8000/api/me", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setUser(res.data.user);
        console.log(res.data.user);
      }
    };
    fetchUser();
  }, [token]);
  return (
    <nav className="bg-emerald-200 p-4 flex justify-between">
      <div className="text-xl font-bold">Chat App</div>
      <h1>{user.name}</h1>
    </nav>
  );
};

export default Navbar;
