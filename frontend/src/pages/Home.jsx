import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
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
        const { email, name, picture } = result.data.user;
        // console.log("Google User:", result.data.user);
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
  });

  const formSubmit = async (data) => {
    // console.log(data);
    try{
      if(isLogin){
        const res = await axios.post("http://localhost:8000/api/login", data);
        console.log("Login Success", res.data);
        navigate("/chat");
      }else{
        const res = await axios.post("http://localhost:8000/api/signup", data);
        console.log("Sign Up Success", res.data);
      }
      reset();
    }catch(err){
      console.error("auth error: ", err)
    }
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
              />
            </div>
          )}
          <button className="w-full font-bold text-xl bg-blue-500 hover:bg-blue-400 p-1.5 rounded-md">
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
