import React from 'react'

const EditUserProfile = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-100 shadow-lg rounded-2xl w-full max-w-md p-6 relative">
        <div>Edit Profile</div>
        <div className='mt-3'>
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="username">
                Username:
            </label>
            <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your username"
                autoComplete='off'
            />
        </div>
        <div className='mt-3'>
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="email">
                Email:
            </label>
            <input  
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
                autoComplete='off'
            />
        </div>
        <div className='mt-3'>
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="profilePicture">
                Profile Picture:
            </label>
            <input
                type="file"
                id="profilePicture"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter profile picture URL"
                autoComplete='off'
            />
        </div>
        

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserProfile
