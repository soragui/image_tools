import React, { useState } from 'react';
import { User, Mail, Key } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile updated:', { username, email, password });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded px-10 py-2 w-full"
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-10 py-2 w-full"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-10 py-2 w-full"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;