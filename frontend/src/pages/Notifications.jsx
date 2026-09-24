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
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    try {
      await api.put('/notifications/read-all');
      load();
    } catch (e) {
      console.warn(e);
    }
  };

  const markOne = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch (e) {
      console.warn(e);
    }
  };

  if (loading) return <LoadingSpinner label="Loading notifications…" />;

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#222325]">Notifications</h1>
            <p className="text-xs text-[#74767e] mt-0.5">Stay updated on your Gig orders, deliveries, and requests.</p>
          </div>
          {items.some((n) => !n.is_read) && (
            <button
              onClick={markAll}
              className="text-xs font-bold text-[#1dbf73] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#e4e5e7] rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <HiOutlineBell className="text-4xl mx-auto mb-2 text-[#1dbf73]" />
            <p className="font-semibold text-sm text-[#222325]">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">When you receive an order update or message, it will show up here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                  n.is_read
                    ? 'border-[#e4e5e7] bg-white text-[#62646a]'
                    : 'border-[#1dbf73]/40 bg-[#eefaf4] text-[#222325] shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.is_read ? 'bg-gray-100 text-gray-400' : 'bg-[#1dbf73] text-white'
                  }`}
                >
                  <HiOutlineBell className="text-base" />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-medium leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(n.sent_at).toLocaleString()}
                  </span>
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => markOne(n._id)}
                    className="p-1 rounded-full text-gray-400 hover:text-[#1dbf73] transition-colors"
                    title="Mark read"
                  >
                    <HiOutlineCheck className="text-base" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
