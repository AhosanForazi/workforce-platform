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
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] blueprint-bg flex items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ticket w-full max-w-md shadow-ticket p-8"
      >
        <span className="font-mono text-xs tracking-widest text-hazard">// SIGN IN</span>
        <h1 className="font-display font-bold text-3xl mt-1 mb-6">Welcome back to the board.</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
              <HiOutlineMail className="text-ink/40" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full outline-none bg-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
              <HiOutlineLockClosed className="text-ink/40" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full outline-none bg-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink/60">
          New here?{' '}
          <Link to="/register" className="text-hazard font-semibold">
            Create an account
          </Link>
        </p>
        <div className="mt-6 pt-4 ticket-perf text-xs text-ink/40 font-mono leading-relaxed">
          Demo: customer@workforce.app / customer123
          <br />
          Demo: karim.electrician@workforce.app / worker123
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
