import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', location: user?.location || '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', experience: '', service_type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      const { data } = await api.get('/auth/me');
      setForm({ name: data.user.name, phone: data.user.phone || '', location: data.user.location || '' });
      if (data.workerProfile) {
        setWorkerForm({
          bio: data.workerProfile.bio || '',
          experience: data.workerProfile.experience || '',
          service_type: data.workerProfile.service_type || '',
        });
      }
    };
    fetchMe();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', form);
      setUser({ ...user, ...data });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const saveWorkerProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/workers/me', workerForm);
      toast.success('Worker profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-14">
      <span className="font-mono text-xs tracking-widest text-hazard">// ACCOUNT SETTINGS</span>
      <h1 className="font-display font-bold text-4xl mt-2 mb-8">Your profile</h1>

      <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={saveProfile} className="ticket p-7 shadow-card space-y-4 mb-8">
        <h2 className="font-display font-bold text-xl mb-2">Basic info</h2>
        <div>
          <label className="text-sm font-semibold">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent" />
        </div>
        <div>
          <label className="text-sm font-semibold">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent" />
        </div>
        <div>
          <label className="text-sm font-semibold">Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent" />
        </div>
        <button disabled={saving} className="px-6 py-2.5 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </motion.form>

      {user?.role === 'worker' && (
        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={saveWorkerProfile} className="ticket p-7 shadow-card space-y-4">
          <h2 className="font-display font-bold text-xl mb-2">Worker details</h2>
          <div>
            <label className="text-sm font-semibold">Primary trade</label>
            <input value={workerForm.service_type} onChange={(e) => setWorkerForm({ ...workerForm, service_type: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent" />
          </div>
          <div>
            <label className="text-sm font-semibold">Experience</label>
            <input value={workerForm.experience} onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent" placeholder="e.g. 5-8 years" />
          </div>
          <div>
            <label className="text-sm font-semibold">Bio</label>
            <textarea rows={4} value={workerForm.bio} onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })} className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent resize-none" />
          </div>
          <button disabled={saving} className="px-6 py-2.5 rounded-lg bg-ink text-concrete font-bold hover:bg-hazard hover:text-ink transition-colors">
            {saving ? 'Saving…' : 'Update worker profile'}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default Profile;
