import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosClient.get('/profile')
      .then(res => {
        const user = res.data.user;
        const post = user.posts.find(p => p._id === id);
        if (!post) {
          // Post not found, redirect to profile
          return navigate('/profile');
        }
        setUser(user);
        setContent(post.content);
      })
      .catch(() => navigate('/profile'));
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient.post(`/edit/${id}`, { content })
      .then(() => navigate('/profile'))
      .catch(() => alert('Failed to update post'));
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white p-8">
      <div className="mb-5 flex justify-end">
        <a href="/logout" className="bg-red-600 text-md font-bold px-4 py-2 rounded-md m-2">Logout</a>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Hello, {user?.name} 👋🏻</h1>
        <h5 className="font-light">You can edit your post.</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="p-3 bg-transparent border-2 border-zinc-500 w-1/3 outline-none resize-none rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Update your post"
          required
        />
        <input
          type="submit"
          className="text-lg px-7 py-1.5 bg-yellow-500 rounded-md block mt-4"
          value="Update Post"
        />
      </form>
    </div>
  );
}
