import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userInfo, updateProfile } from "../features/userSlice";
import { toast } from "react-hot-toast";

const EditUserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userProfile: user, loading } = useSelector(
    (state) => state.user || {}
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    pic: "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch current user
  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  // Prefill fields once user is loaded
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        pic: user.pic,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (!file) return;

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast("Please select a proper type of image (JPEG/PNG)", {
        icon: "⚠️",
        style: {
          borderRadius: "9px",
          background: "#fff",
          color: "#e68a00",
        },
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");

    try {
      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dkgvimtjm/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        setForm((prev) => ({ ...prev, pic: uploadData.secure_url }));
      }
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const updatedData = {
      name: form.name,
      pic: form.pic,
      email: form.email,
    };

    await dispatch(updateProfile(updatedData)).then(() => {
      toast.success("Profile updated successfully!");
    })
    navigate("/profile");
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-100 shadow-lg rounded-2xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-3">Edit Profile</h2>

        {/* Name */}
        <div className="mt-3">
          <label className="block text-gray-900 font-semibold mb-2">
            Username:
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            autoComplete="off"
          />
        </div>

        {/* Email */}
        <div className="mt-3">
          <label className="block text-gray-900 font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            autoComplete="off"
            disabled
          />
        </div>

        {/* Profile Picture */}
        <div className="mt-3">
          <label className="block text-gray-900 font-semibold mb-2">
            Profile Picture:
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
