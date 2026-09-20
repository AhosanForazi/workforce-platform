import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineCamera,
  HiArrowRight,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const [b, n] = await Promise.all([
        api.get('/bookings/my').catch((err) => {
          console.warn('Could not fetch bookings:', err.message);
          return { data: [] };
        }),
        api.get('/notifications').catch((err) => {
          console.warn('Could not fetch notifications:', err.message);
          return { data: [] };
        }),
      ]);
      setBookings(Array.isArray(b.data) ? b.data : []);
      setNotifications(Array.isArray(n.data) ? n.data : []);
    } catch (e) {
      console.error('Dashboard load error:', e);
      setLoadError(e.message || 'Could not load dashboard data');
      setBookings([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="ticket p-8 shadow-card space-y-4">
          <HiOutlineUserCircle className="text-5xl text-hazard mx-auto" />
          <h2 className="font-display font-bold text-2xl">Log In to View Dashboard</h2>
          <p className="text-sm text-ink/60">Please sign in to access your jobs, bookings, and alerts.</p>
          <Link
            to="/login"
            className="inline-block w-full py-3 rounded-lg bg-hazard text-ink font-bold hover:bg-ink hover:text-hazard transition-colors"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading your board…" />;

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const active = safeBookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b?.status));
  const completed = safeBookings.filter((b) => b?.status === 'completed');

  const stats = [
    { label: 'Active jobs', value: active.length, icon: HiOutlineClipboardList, color: 'text-hazard' },
    { label: 'Completed jobs', value: completed.length, icon: HiOutlineStar, color: 'text-signal' },
    { label: 'Unread alerts', value: notifications.filter((n) => !n.is_read).length, icon: HiOutlineBell, color: 'text-dispatch' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="mb-10 flex items-center justify-between flex-wrap gap-6 ticket p-6 shadow-card border border-ink/10">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative group shrink-0" title="Change profile photo">
            {/* Round Shape Profile Avatar Frame */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-dispatch border-4 border-panel ring-3 ring-hazard/50 flex items-center justify-center shadow-card group-hover:ring-hazard group-hover:scale-105 transition-all">
              <img
                src={getAvatarUrl(user?.avatar, user?.role === 'worker' ? 'Worker' : '', user?.name)}
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getFallbackSvgAvatar(user?.name);
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-hazard text-ink text-xs shadow-md group-hover:scale-110 transition-transform border border-panel">
              <HiOutlineCamera />
            </span>
          </Link>
          <div>
            <span className="font-mono text-xs tracking-widest text-hazard">// {user?.role?.toUpperCase()} DASHBOARD</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl mt-1">Welcome back, {user?.name?.split(' ')[0]}.</h1>
            <p className="text-xs text-ink/60 mt-0.5">
              {user?.role === 'worker' ? 'Manage your jobs, schedule, and profile dispatch details.' : 'Track your bookings and service requests.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-ink font-semibold hover:bg-ink hover:text-concrete transition-colors text-sm">
            <HiOutlineUserCircle className="text-lg" /> Edit profile & photo
          </Link>
        </div>
      </div>

      {loadError && (
        <div className="mb-8 p-4 rounded-xl bg-hazard/10 border border-hazard/30 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-ink/80">
            <strong>Connection Notice:</strong> {loadError}
          </p>
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-lg bg-ink text-concrete text-xs font-bold hover:bg-hazard hover:text-ink transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

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
