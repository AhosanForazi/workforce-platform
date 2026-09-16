import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBell, HiOutlineCheck } from 'react-icons/hi';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    load();
  };

  const markOne = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  if (loading) return <LoadingSpinner label="Checking the wire…" />;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-xs tracking-widest text-hazard">// ALERTS</span>
          <h1 className="font-display font-bold text-4xl mt-2">Notifications</h1>
        </div>
        {items.some((n) => !n.is_read) && (
          <button onClick={markAll} className="text-sm font-semibold text-hazard">Mark all as read</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="ticket p-10 text-center text-ink/50">
          <HiOutlineBell className="text-3xl mx-auto mb-2" /> Nothing here yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${n.is_read ? 'border-ink/5 bg-panel' : 'border-hazard/40 bg-hazard/5'}`}
            >
              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.is_read ? 'bg-ink/20' : 'bg-hazard animate-pulseDot'}`} />
              <div className="flex-1">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-ink/40 font-mono mt-1">{new Date(n.sent_at).toLocaleString()}</p>
              </div>
              {!n.is_read && (
                <button onClick={() => markOne(n._id)} className="text-ink/40 hover:text-signal">
                  <HiOutlineCheck />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
