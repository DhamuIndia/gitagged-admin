'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // ⬅️ prevents hydration mismatch
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3002/admin-auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('adminToken', res.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // return (
  //   <div className="p-10 max-w-sm mx-auto">
  //     <h1 className="text-xl font-bold mb-4 text-center">Admin Login</h1>

  //     <input
  //       className="border p-2 w-full mb-2 text-center"
  //       placeholder="Email / UserName"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       autoComplete="off"
  //     />

  //     <input
  //       className="border p-2 w-full mb-4 text-center"
  //       type="password"
  //       placeholder="Password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       autoComplete="new-password"
  //     />

  //     <button
  //       onClick={handleLogin}
  //       className="bg-black text-white px-4 py-2 w-full"
  //     >
  //       Login
  //     </button>
  //   </div>
  // );
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      {/* LOGIN CARD */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Welcome <span className="font-bold">GITAGGED Admin</span>
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            // placeholder="UserName or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            // placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="text-sm mb-6 cursor-pointer hover:underline">
          Forgot password?
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-md font-semibold transition-all duration-200"
        >
          SUBMIT
        </button>

      </div>
    </div>
  );
}
