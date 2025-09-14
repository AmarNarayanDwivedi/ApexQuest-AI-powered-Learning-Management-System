import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(userData.photoUrl || null); // preview state
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photoFile) formData.append("photoUrl", photoFile);

      const result = await axios.post(
        serverUrl + "/api/user/updateprofile",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Profile Updated Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Profile Update Error");
    } finally {
      setLoading(false);
    }
  };

  // handle file input + preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Profile Photo Preview */}
          <div className="flex flex-col items-center text-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white">
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          {/* File Input restricted to images */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Avatar
            </label>
            <input
              type="file"
              name="photoUrl"
              accept="image/*" // ✅ only photos
              className="w-full px-4 py-2 border rounded-md text-sm"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder={userData.name}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              readOnly
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
              placeholder={userData.email}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-black"
              rows={3}
              placeholder="Tell us about yourself"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-black active:bg-[#454545] text-white py-2 rounded-md font-medium transition"
            disabled={loading}
            onClick={updateProfile}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
