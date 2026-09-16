import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineStar, HiOutlineBell, HiOutlineUserCircle, HiArrowRight } from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, n] = await Promise.all([api.get('/bookings/my'), api.get('/notifications')]);
        setBookings(b.data);
        setNotifications(n.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading your board…" />;

  const active = bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'completed');

  const stats = [
    { label: 'Active jobs', value: active.length, icon: HiOutlineClipboardList, color: 'text-hazard' },
    { label: 'Completed jobs', value: completed.length, icon: HiOutlineStar, color: 'text-signal' },
    { label: 'Unread alerts', value: notifications.filter((n) => !n.is_read).length, icon: HiOutlineBell, color: 'text-dispatch' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="font-mono text-xs tracking-widest text-hazard">// {user?.role?.toUpperCase()} DASHBOARD</span>
          <h1 className="font-display font-bold text-4xl mt-2">Welcome, {user?.name?.split(' ')[0]}.</h1>
        </div>
        <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-ink font-semibold hover:bg-ink hover:text-concrete transition-colors">
          <HiOutlineUserCircle /> Edit profile
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="ticket p-6 shadow-card"
          >
            <s.icon className={`text-3xl mb-2 ${s.color}`} />
            <div className="font-display font-bold text-4xl">{s.value}</div>
            <div className="text-sm text-ink/50">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-2xl">Recent bookings</h2>
        <Link to="/bookings" className="flex items-center gap-1 text-hazard font-semibold text-sm">
          View all <HiArrowRight />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="ticket p-10 text-center text-ink/50">
          No bookings yet.{' '}
          {user?.role === 'customer' ? (
            <Link to="/browse" className="text-hazard font-semibold">Find a worker to get started.</Link>
          ) : (
            'Your bookings will appear here once a customer books you.'
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 5).map((b) => (
            <div key={b._id} className="ticket flex flex-wrap items-center justify-between gap-3 p-4 shadow-card">
              <div>
                <p className="font-semibold">{b.service_id?.service_name}</p>
                <p className="text-xs text-ink/50 font-mono">{new Date(b.date_time).toLocaleString()}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
