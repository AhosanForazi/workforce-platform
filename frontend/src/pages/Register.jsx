import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', location: '', service_type: 'Electrician',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      toast.success('Account created — welcome to WorkForce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] blueprint-bg flex items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ticket w-full max-w-lg shadow-ticket p-8"
      >
        <span className="font-mono text-xs tracking-widest text-hazard">// NEW JOB TICKET</span>
        <h1 className="font-display font-bold text-3xl mt-1 mb-6">Create your account.</h1>

        <div className="flex gap-2 mb-6 bg-concrete rounded-lg p-1">
          {['customer', 'worker'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-md text-sm font-bold capitalize transition-colors ${
                role === r ? 'bg-hazard text-ink' : 'text-ink/50 hover:text-ink'
              }`}
            >
              I'm a {r}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Full name</label>
              <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
                <HiOutlineUser className="text-ink/40" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full outline-none bg-transparent" placeholder="Jane Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Phone</label>
              <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
                <HiOutlinePhone className="text-ink/40" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full outline-none bg-transparent" placeholder="+8801XXXXXXXXX" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
              <HiOutlineMail className="text-ink/40" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full outline-none bg-transparent" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Location</label>
            <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
              <HiOutlineLocationMarker className="text-ink/40" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full outline-none bg-transparent" placeholder="Faridpur, Dhaka Division" />
            </div>
          </div>

          {role === 'worker' && (
            <div>
              <label className="text-sm font-semibold">Primary trade</label>
              <select
                value={form.service_type}
                onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
              >
                {['Electrician', 'Plumber', 'Painter', 'Carpenter', 'Gardener', 'Cleaner'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
              <HiOutlineLockClosed className="text-ink/40" />
              <input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full outline-none bg-transparent" placeholder="At least 6 characters" />
            </div>
          </div>

          <button disabled={loading} className="w-full py-3 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors disabled:opacity-60">
            {loading ? 'Creating account…' : `Create ${role} account`}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink/60">
          Already registered?{' '}
          <Link to="/login" className="text-hazard font-semibold">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
