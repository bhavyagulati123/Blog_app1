import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    age: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/register`, formData, {
        withCredentials: true,
      });
      alert('Account created. Please login.');
      navigate('/profile');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Registration failed.');
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white m-auto p-5 flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-6 font-bold">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          name="name"
          placeholder="name"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="username"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="age"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="submit"
          value="Submit"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Register;
