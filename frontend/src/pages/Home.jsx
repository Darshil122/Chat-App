import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { token } = result.data;
        jsonWebToken(token);
        navigate("/chat");
      } else {
        console.log("No code returned:", authResult);
      }
    } catch (err) {
      console.error(
        "Google request failed:",
        err.response?.data || err.message
      );
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
    // ux_mode : "popup",
  });

  const formSubmit = async (data) => {
    setLoading(true);
    let imageUrl = "";

    try {
      if (!isLogin && image) {
        if (image.type === "image/jpeg" || image.type === "image/png") {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "chat-app");

          const uploadRes = await fetch(
            "https://api.cloudinary.com/v1_1/dkgvimtjm/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const uploadData = await uploadRes.json();

          if (uploadData.error) {
            throw new Error(uploadData.error.message);
          }

          imageUrl = uploadData.secure_url;
        } else {
          toast("Please select a proper type of image (JPEG/PNG)", {
            icon: "⚠️",
            style: {
              borderRadius: "9px",
              background: "#fff",
              color: "#e68a00",
            },
          });

          setLoading(false);
          return;
        }
      }

      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { ...data, pic: imageUrl };

      // console.log("User Data", payload);

      let res;
      if (isLogin) {
        res = await axios.post("http://localhost:8000/auth/login", payload);
      } else {
        res = await axios.post("http://localhost:8000/auth/signup", payload);
      }

      toast.success(res.data.message);

      // console.log("message", res.data.message);
      const Usertoken = res.data.token;
      jsonWebToken(Usertoken);
      reset();
      navigate("/chat");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong during authentication";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const jsonWebToken = (token) => {
    localStorage.setItem("token", token);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white p-7 rounded-md shadow-md w-full max-w-sm">
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* toggle button sign in && sign up */}
          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`font-bold text-xl w-full rounded-md ${
                isLogin
                  ? "text-gray-800 bg-blue-300 py-1"
                  : "text-gray-800 hover:border border-blue-300"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`font-bold text-xl w-full rounded-md ${
                !isLogin
                  ? "text-gray-800 bg-blue-300 py-1"
                  : "text-gray-800 hover:border border-blue-300"
              }`}
            >
              Sign Up
            </button>
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold text-gray-700">
                Name:
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                id="name"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                autoComplete="name"
                {...register("name", { required: "name is required" })}
              />
              {errors.name && (
                <strong className="text-red-500">{errors.name.message}</strong>
              )}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="font-semibold text-gray-700">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              {...register("email", { required: "email is required" })}
            />
            {errors.email && (
              <strong className="text-red-500">{errors.email.message}</strong>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="font-semibold text-gray-700">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 5,
                  message: "password must be at least 5 character",
                },
              })}
            />
            {errors.password && (
              <strong className="text-red-500">
                {errors.password.message}
              </strong>
            )}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="pic" className="font-semibold text-gray-700">
                Upload Picture:
              </label>
              <input
                type="file"
                id="pic"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          )}
          <button
            className={`w-full font-bold text-xl bg-blue-500 hover:bg-blue-400 p-1.5 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <h4 className="flex justify-center mt-3">OR</h4>
        <button
          className="w-full rounded-md p-1.5 bg-gray-500 hover:bg-gray-400"
          onClick={() => loginWithGoogle()}
        >
          Login With Google
        </button>
      </div>
    </div>
  );
};

export default Home;
