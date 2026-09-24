import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to Workforce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-[85vh] bg-[#f7f7f7] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#e4e5e7] rounded-xl shadow-fiverr w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#222325]">
            workforce<span className="text-[#1dbf73]">.</span>
          </Link>
          <h1 className="text-xl font-bold text-[#222325] mt-2">Sign in to your account</h1>
          <p className="text-xs text-[#74767e] mt-1">Don't have an account?{' '}
            <Link to="/register" className="text-[#1dbf73] font-bold hover:underline">
              Join here
            </Link>
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Email Address</label>
            <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2.5 bg-white">
              <HiOutlineMail className="text-gray-400 text-lg" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs text-[#222325] focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Password</label>
            <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2.5 bg-white">
              <HiOutlineLockClosed className="text-gray-400 text-lg" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full text-xs text-[#222325] focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm tracking-wide transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Continue'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-[#efeff0]">
          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
            Quick Fill Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('customer@workforce.app', 'customer123')}
              className="py-1.5 px-2 rounded border border-gray-200 hover:border-[#1dbf73] hover:bg-[#eefaf4] text-[#404145] font-semibold transition-all text-center"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('karim.electrician@workforce.app', 'worker123')}
              className="py-1.5 px-2 rounded border border-gray-200 hover:border-[#1dbf73] hover:bg-[#eefaf4] text-[#404145] font-semibold transition-all text-center"
            >
              Worker
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@workforce.app', 'admin123')}
              className="py-1.5 px-2 rounded border border-gray-200 hover:border-[#1dbf73] hover:bg-[#eefaf4] text-[#404145] font-semibold transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
