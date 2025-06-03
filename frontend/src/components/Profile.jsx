import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState("");
  const navigate = useNavigate();

  // Fetch user data on mount
  const fetchUser = async () => {
    try {
      const res = await axiosClient.get("/profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axiosClient.get("/logout", { withCredentials: true });
    navigate("/login");
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await axiosClient.post(
        "/post",
        { content: newPost },
        { withCredentials: true }
      );
      setNewPost("");
      await fetchUser();
    } catch (error) {
      alert("Failed to create post");
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      await axiosClient.get(`/like/${postId}`, {
        withCredentials: true,
      });
      await fetchUser();
    } catch (error) {
      alert("Failed to toggle like",error);
    }
  };
const BASE_URL = "https://blog-app1-9gu6.onrender.com";
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosClient.delete(`/delete/${postId}`, {
        withCredentials: true,
      });
      await fetchUser();
    } catch (error) {
      alert("Failed to delete post",error);
    }
  };

  if (!user)
    return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    
    <div className="bg-zinc-900 min-h-screen text-white p-8">
        <div className="flex justify-between items-center mb-6">
  <Link
    to="/"
    className="bg-yellow-600 text-md font-bold px-4 py-2 rounded-md hover:bg-yellow-700 transition"
  >
    Home
  </Link>

  <button
    onClick={handleLogout}
    className="bg-red-600 text-md font-bold px-4 py-2 rounded-md hover:bg-red-700 transition"
  >
    Logout
  </button>
</div>

    

      <div className="flex items-center gap-4 mb-6">
        <img
          src={`${BASE_URL}/public/images/upload/${
            user.profilepic || "default.png"
          }`}
          alt="profile pic"
          className="w-16 h-16 rounded-md object-cover cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/update-profile-pic")}
        />

        <h1 className="text-3xl font-bold">Hello, {user.name} 👋🏻</h1>
      </div>

      <h5 className="font-light mb-4">You can create a post.</h5>
      <form onSubmit={handlePostSubmit} className="mb-10">
        <textarea
          placeholder="What's on your mind"
          className="w-1/4 p-3 bg-transparent border-2 border-zinc-500 rounded-md resize-none outline-none text-white"
          rows={4}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
        />
        <br />
        <input
          type="submit"
          value="Submit"
          className="mt-2 px-7 py-1.5 bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition"
        />
      </form>

      <h1 className="text-2xl font-bold mb-4">Your Posts</h1>
      <div className="flex flex-wrap gap-4">
        {user.posts.length === 0 && (
          <p className="text-gray-400">No posts yet. Start by creating one!</p>
        )}
        {user.posts.map((post) => (
          <div
            key={post._id}
            className="w-1/5 bg-zinc-800 p-4 border-2 border-zinc-700 rounded-md flex flex-col justify-between"
          >
            <h3 className="text-blue-400 mb-2">@{user.username}</h3>
            <p className="flex-grow text-white">{post.content}</p>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleLikeToggle(post._id)}
                  className="text-blue-400 hover:underline"
                >
                  {post.likes.includes(user._id) ? "Unlike" : "Like"}
                </button>
                <Link
                  to={`/edit/${post._id}`}
                  className="text-green-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
