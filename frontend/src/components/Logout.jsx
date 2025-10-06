import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    toast.success("User Logout Successfully");
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
};

export default Logout;
