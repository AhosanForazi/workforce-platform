import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineStar } from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'in_progress',
  in_progress: 'completed',
};

const ReviewForm = ({ booking, onDone }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post('/reviews', { booking_id: booking._id, rating, comment });
      toast.success('Review submitted — thank you!');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 pt-3 ticket-perf">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)}>
            <HiOutlineStar className={`text-2xl ${n <= rating ? 'text-hazard fill-hazard' : 'text-ink/20'}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How did it go?"
        rows={2}
        className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-hazard resize-none"
      />
      <button disabled={submitting} onClick={submit} className="mt-2 px-4 py-2 rounded-lg bg-hazard font-bold text-sm hover:bg-ink hover:text-hazard transition-colors">
        {submitting ? 'Sending…' : 'Submit review'}
      </button>
    </div>
  );
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const advance = async (booking) => {
    try {
      await api.put(`/bookings/${booking._id}/status`, { status: NEXT_STATUS[booking.status] });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const cancel = async (booking) => {
    try {
      await api.put(`/bookings/${booking._id}/status`, { status: 'cancelled', cancellation_reason: 'Cancelled by user' });
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <LoadingSpinner label="Pulling job tickets…" />;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <span className="font-mono text-xs tracking-widest text-hazard">// JOB TICKETS</span>
      <h1 className="font-display font-bold text-4xl mt-2 mb-8">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="ticket p-10 text-center text-ink/50">No bookings yet.</div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="ticket p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink/40">#{b._id.slice(-6).toUpperCase()}</p>
                  <h3 className="font-display font-bold text-xl">{b.service_id?.service_name}</h3>
                  <p className="text-sm text-ink/60">
                    {user.role === 'customer'
                      ? `Worker: ${b.worker_id?.user_id?.name || 'N/A'}`
                      : `Customer: ${b.customer_id?.name || 'N/A'}`}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="ticket-perf mt-4 pt-4 flex flex-wrap gap-5 text-sm text-ink/60">
                <span className="flex items-center gap-1"><HiOutlineCalendar /> {new Date(b.date_time).toLocaleString()}</span>
                <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {b.address}</span>
                {b.estimatedCost > 0 && <span className="font-mono font-semibold">৳{b.estimatedCost}</span>}
              </div>
              {b.notes && <p className="mt-2 text-sm text-ink/50 italic">"{b.notes}"</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                {user.role === 'worker' && NEXT_STATUS[b.status] && (
                  <button onClick={() => advance(b)} className="px-4 py-2 rounded-lg bg-ink text-concrete text-sm font-semibold hover:bg-hazard hover:text-ink transition-colors">
                    Mark as {NEXT_STATUS[b.status].replace('_', ' ')}
                  </button>
                )}
                {['pending', 'accepted'].includes(b.status) && (
                  <button onClick={() => cancel(b)} className="px-4 py-2 rounded-lg border-2 border-alert text-alert text-sm font-semibold hover:bg-alert hover:text-white transition-colors">
                    Cancel
                  </button>
                )}
                {user.role === 'customer' && b.status === 'completed' && (
                  <button onClick={() => setReviewingId(reviewingId === b._id ? null : b._id)} className="px-4 py-2 rounded-lg bg-hazard text-sm font-bold">
                    {reviewingId === b._id ? 'Close' : 'Leave a review'}
                  </button>
                )}
              </div>

              {reviewingId === b._id && (
                <ReviewForm booking={b} onDone={() => { setReviewingId(null); load(); }} />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
