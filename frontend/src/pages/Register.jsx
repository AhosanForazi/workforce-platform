import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // 'customer' (Buyer) | 'worker' (Seller)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    service_type: 'Electrician',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      toast.success('Account created — welcome to Workforce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f7f7f7] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#e4e5e7] rounded-xl shadow-fiverr w-full max-w-lg p-8"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#222325]">
            workforce<span className="text-[#1dbf73]">.</span>
          </Link>
          <h1 className="text-xl font-bold text-[#222325] mt-2">Create a new account</h1>
          <p className="text-xs text-[#74767e] mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1dbf73] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Account Mode Switcher (Buyer vs Seller) */}
        <div className="flex gap-2 mb-6 bg-[#f7f7f7] rounded-lg p-1 border border-[#efeff0]">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2.5 rounded text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-white text-[#222325] shadow-sm'
                : 'text-[#74767e] hover:text-[#222325]'
            }`}
          >
            I'm a Buyer (Hiring)
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex-1 py-2.5 rounded text-xs font-bold transition-all ${
              role === 'worker'
                ? 'bg-white text-[#1dbf73] shadow-sm'
                : 'text-[#74767e] hover:text-[#222325]'
            }`}
          >
            I'm a Seller (Worker Pro)
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Full Name</label>
              <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
                <HiOutlineUser className="text-gray-400 text-lg" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs text-[#222325] focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Email Address</label>
              <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
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
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Phone Number</label>
              <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
                <HiOutlinePhone className="text-gray-400 text-lg" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-xs text-[#222325] focus:outline-none"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Location / Area</label>
              <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
                <HiOutlineLocationMarker className="text-gray-400 text-lg" />
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full text-xs text-[#222325] focus:outline-none"
                  placeholder="Faridpur / Dhaka"
                />
              </div>
            </div>
          </div>

          {role === 'worker' && (
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Your Primary Trade / Skill</label>
              <select
                value={form.service_type}
                onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                className="w-full border border-[#b5b6ba] focus:border-[#1dbf73] rounded-md px-3 py-2 text-xs text-[#222325] focus:outline-none bg-white"
              >
                <option value="Electrician">Electrician & Wiring</option>
                <option value="Plumber">Plumbing & Water</option>
                <option value="Painter">Painting & Walls</option>
                <option value="Carpenter">Carpentry & Woodwork</option>
                <option value="Cleaner">Home Deep Cleaning</option>
                <option value="Gardener">Gardening & Landscaping</option>
                <option value="Technician">AC & Appliance Repair</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Password</label>
            <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
              <HiOutlineLockClosed className="text-gray-400 text-lg" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full text-xs text-[#222325] focus:outline-none"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm tracking-wide transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account…' : 'Join Workforce'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
