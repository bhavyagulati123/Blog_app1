// src/components/Landing.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import ClaxiosClientClient from "../ClaxiosClientClient";
import axiosClient from "../axiosClient";

const Landing = () => {
  const [posts, setPosts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth + fetch posts
  useEffect(() => {
    axiosClient.get("/profile", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));

    fetchPosts();
  }, []);

  // Fetch posts helper
  const fetchPosts = async () => {
    try {
      const res = await axiosClient.get("/all-posts");
      console.log("Posts response:", res.data); 
      setPosts(res.data);
    } catch (err) {
      console.error("Post fetch failed:", err);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axiosClient.get("/logout", { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed",err);
    }
  };

  // Like toggle handler - sends GET request to /like/:id
  const handleLike = async (postId) => {
    try {
      await axiosClient.get(`/like/${postId}`, { withCredentials: true });
      // Refresh posts after like toggled to update UI
      fetchPosts();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Postify ✨</h1>
          <p className="text-gray-300">See what people are thinking.</p>
        </div>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-2xl font-semibold mb-4">Public Feed</h2>
      <div className="flex flex-wrap gap-4 ">
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-md">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={`https://blog-app1-9gu6.onrender.com/public/images/upload/${post.profilepic || 'default.png'}`}
                  alt="pfp"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">@{post.username}</h3>
              </div>
              <p className="text-white">{post.content}</p>
              <p className="text-sm text-gray-400 mt-3">
                {post.likes} {post.likes === 1 ? "like" : "likes"}
              </p>

              {/* Like button only for logged in users */}
              {isAuthenticated && (
                <button
                  onClick={() => handleLike(post._id)}
                  className="mt-2 bg-purple-600 px-3 py-1 rounded-md hover:bg-purple-700 transition"
                >
                  Like
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Landing;
