import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/auth', { email, password }, { withCredentials: true });
      navigate('/profile');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white m-auto p-5 flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-6 font-bold">Login Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="email"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="text-lg px-7 py-1 bg-transparent outline-none border-2 border-zinc-500 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="submit"
          value="Submit"
          className="text-lg px-7 py-1.5 bg-blue-500 rounded-md cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Login;
