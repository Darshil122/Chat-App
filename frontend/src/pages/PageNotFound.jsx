import React from 'react'
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
    const goHome = () => {
      const token = localStorage.getItem("token");
      navigate(token ? "/chat" : "/");
    }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default PageNotFound
