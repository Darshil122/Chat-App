import React from 'react'
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="max-w-sm">
      <h1>404 || Page Not Found</h1>
      <button className="p-2 mt-2 bg-amber-700 rounded-md text-white" onClick={()=> navigate("/")}>Go to Home</button>
      </div>
    </div>
  );
}

export default PageNotFound
