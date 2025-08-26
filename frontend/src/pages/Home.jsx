import { useState } from "react";
import { useForm } from "react-hook-form";
// import axios from "axios";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const formSubmit = (data) => {
    console.log(data);
    reset();
  };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4">
      <form
        className="bg-white p-7 rounded-md shadow-md w-full max-w-sm"
        onSubmit={handleSubmit(formSubmit)}
      >
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
          {errors.password && (<strong className="text-red-500">{errors.password.message}</strong>)}
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
    </div>
  );
};

export default Home;
