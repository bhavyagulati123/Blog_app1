
import Landing from "./components/Landing";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import ProfilePic from "./components/ProfilePic";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile-pic" element={<ProfilePic />} />{" "}
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
};

export default App;
