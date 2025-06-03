// ProfilePic.jsx
import React, { useState } from 'react';
import axiosClient from '../axiosClient'; // or use axios directly
import { useNavigate } from 'react-router-dom';

const ProfilePic = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("profile", file);

    try {
      await axiosClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      alert('Profile picture updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert('Failed to upload profile picture.');
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white p-8">
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => navigate('/profile')}
          className="bg-gray-700 text-md font-bold px-4 py-2 rounded-md m-2"
        >
          Back
        </button>
      </div>
      <div className="mb-8">
        <h1 className="font-light text-2xl">Upload Your Profile Picture</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="profile"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <input
          type="submit"
          value="Update Profile Pic"
          className="text-lg px-7 py-1.5 bg-yellow-500 rounded-md cursor-pointer"
        />
      </form>
    </div>
  );
};

export default ProfilePic;
