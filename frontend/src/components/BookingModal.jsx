import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getInitials } from '../utils/imageUrl';

const BookingModal = ({ worker, offer, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date_time: '', address: user?.location || '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const estimatedCost = offer?.fixed_price || (offer?.hourly_rate ? offer.hourly_rate * 2 : 0);
  const workerAvatarUrl = worker.avatar || worker.profileImage || worker.user_id?.avatar;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in as a customer to book a worker.');
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only customer accounts can book workers.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        worker_id: worker._id,
        service_id: offer?.service_id?._id,
        date_time: form.date_time,
        address: form.address,
        notes: form.notes,
        estimatedCost,
      });
      toast.success('Booking request sent!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="ticket w-full max-w-md shadow-ticket p-7 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-ink/40 hover:text-ink">
            <HiOutlineX className="text-xl" />
          </button>
          
          <div className="flex items-center gap-3.5 mb-5 pr-6">
            {workerAvatarUrl ? (
              <img
                src={getAvatarUrl(workerAvatarUrl)}
                alt={worker.user_id?.name || 'Worker'}
                className="w-12 h-12 rounded-xl object-cover border border-ink/15 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-dispatch text-concrete flex items-center justify-center font-bold font-display text-lg shrink-0">
                {getInitials(worker.user_id?.name)}
              </div>
            )}
            <div>
              <span className="font-mono text-[10px] tracking-widest text-hazard block">// NEW BOOKING TICKET</span>
              <h2 className="font-display font-bold text-xl leading-tight">Book {worker.user_id?.name}</h2>
              <p className="text-xs text-ink/50 mt-0.5">
                {worker.service_type} · {estimatedCost ? `৳${estimatedCost}` : 'Rate on request'}
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Date & time</label>
              <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
                <HiOutlineCalendar className="text-ink/40" />
                <input
                  required
                  type="datetime-local"
                  value={form.date_time}
                  onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Job address</label>
              <div className="mt-1 flex items-center gap-2 border border-ink/15 rounded-lg px-3 py-2.5 focus-within:border-hazard">
                <HiOutlineLocationMarker className="text-ink/40" />
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full outline-none bg-transparent"
                  placeholder="House / street / area"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Notes for the worker</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent resize-none"
                placeholder="Describe the job briefly…"
              />
            </div>
            <button disabled={submitting} className="w-full py-3 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors disabled:opacity-60">
              {submitting ? 'Dispatching…' : 'Confirm booking request'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
