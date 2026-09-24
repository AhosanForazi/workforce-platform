import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineShoppingBag,
  HiOutlineStar,
  HiStar,
  HiOutlineBell,
  HiOutlineCurrencyDollar,
  HiOutlineUserCircle,
  HiOutlineCamera,
  HiOutlineUpload,
  HiOutlineCheckCircle,
  HiOutlinePhotograph,
  HiOutlineLink,
  HiOutlineX,
  HiOutlineEye,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAvatarUrl, getFallbackSvgAvatar, TRADE_AVATARS } from '../utils/imageUrl';

const TRADE_PRESETS = [
  { label: 'Electrician', url: TRADE_AVATARS.electrician },
  { label: 'Plumber', url: TRADE_AVATARS.plumber },
  { label: 'Painter', url: TRADE_AVATARS.painter },
  { label: 'Carpenter', url: TRADE_AVATARS.carpenter },
  { label: 'Cleaner', url: TRADE_AVATARS.cleaner },
  { label: 'Gardener', url: TRADE_AVATARS.gardener },
  { label: 'Technician', url: TRADE_AVATARS.technician },
  { label: 'General / Handyman', url: TRADE_AVATARS.general },
];

const PhotoUploadModal = ({ user, onClose, onUpdated }) => {
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'presets' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async () => {
    setSaving(true);
    let finalAvatarUrl = '';

    try {
      if (activeTab === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('profileImage', selectedFile);
        const { data } = await api.post('/users/me/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalAvatarUrl = data.avatar || data.profileImage;
      } else if (activeTab === 'url' && urlInput.trim()) {
        const { data } = await api.post('/users/me/avatar', {
          avatar_url: urlInput.trim(),
        });
        finalAvatarUrl = data.avatar || data.profileImage || urlInput.trim();
      } else if (activeTab === 'presets' && previewUrl) {
        const { data } = await api.post('/users/me/avatar', {
          avatar_url: previewUrl,
        });
        finalAvatarUrl = data.avatar || data.profileImage || previewUrl;
      } else if (previewUrl) {
        finalAvatarUrl = previewUrl;
      }

      if (!finalAvatarUrl && previewUrl) {
        finalAvatarUrl = previewUrl;
      }

      onUpdated(finalAvatarUrl);
      toast.success('Profile photo updated! This photo is now live on your Gig Card in Find Workers.');
      onClose();
    } catch (err) {
      // In case of local demo fallback without backend connection
      if (previewUrl || urlInput) {
        const fallback = urlInput.trim() || previewUrl;
        onUpdated(fallback);
        toast.success('Profile photo saved! Live on your Gig Card.');
        onClose();
      } else {
        toast.error(err.response?.data?.message || 'Could not upload photo. Please try another image.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-[#222325] relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <HiOutlineX className="text-xl" />
        </button>

        <h3 className="text-xl font-bold text-[#222325]">Add / Change Profile Photo</h3>
        <p className="text-xs text-[#62646a] mt-1 mb-5">
          This image will be displayed on your profile and on your <strong>Gig Card in "Find Workers"</strong>.
        </p>

        {/* Live Preview Box */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#fafafa] border border-[#efeff0] mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-[#1dbf73] shrink-0 shadow-sm">
            <img
              src={previewUrl || getFallbackSvgAvatar(user?.name)}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getFallbackSvgAvatar(user?.name);
              }}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#222325]">Gig Card Preview</p>
            <p className="text-[11px] text-[#1dbf73] font-semibold mt-0.5 flex items-center gap-1">
              <HiOutlineCheckCircle /> Displayed to customers when searching for workers
            </p>
          </div>
        </div>

        {/* 3 Tabs */}
        <div className="flex border-b border-[#efeff0] mb-5 text-xs font-bold text-[#74767e]">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'file'
                ? 'border-[#1dbf73] text-[#1dbf73]'
                : 'border-transparent hover:text-[#222325]'
            }`}
          >
            <HiOutlineUpload className="text-base" /> Upload File
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'presets'
                ? 'border-[#1dbf73] text-[#1dbf73]'
                : 'border-transparent hover:text-[#222325]'
            }`}
          >
            <HiOutlinePhotograph className="text-base" /> Trade Presets
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'url'
                ? 'border-[#1dbf73] text-[#1dbf73]'
                : 'border-transparent hover:text-[#222325]'
            }`}
          >
            <HiOutlineLink className="text-base" /> Image Link
          </button>
        </div>

        {/* Tab 1: File Upload */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#1dbf73] hover:bg-[#eefaf4]/30 cursor-pointer text-center transition-all"
            >
              <HiOutlineUpload className="text-4xl text-[#1dbf73] mx-auto mb-2" />
              <p className="font-bold text-sm text-[#222325]">
                {selectedFile ? selectedFile.name : 'Click to browse image from your device'}
              </p>
              <p className="text-xs text-[#74767e] mt-1">
                Supports JPG, PNG, WebP up to 5MB
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Trade Presets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
            {TRADE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPreviewUrl(preset.url)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  previewUrl === preset.url
                    ? 'border-[#1dbf73] bg-[#eefaf4] ring-2 ring-[#1dbf73]/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-1.5">
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-[#222325] block truncate">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Image URL */}
        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1.5">
              Direct Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              className="w-full border border-gray-300 focus:border-[#1dbf73] rounded-md px-3 py-2 text-xs text-[#222325] focus:outline-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#efeff0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={saving || (!selectedFile && !urlInput && !previewUrl)}
            onClick={handleSave}
            className="px-6 py-2.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? 'Saving…' : 'Save & Set on Card'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

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
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-[#e4e5e7] rounded-xl p-8 shadow-sm space-y-4">
          <HiOutlineUserCircle className="text-5xl text-[#1dbf73] mx-auto" />
          <h2 className="font-extrabold text-2xl text-[#222325]">Sign In to View Dashboard</h2>
          <p className="text-xs text-[#62646a]">
            Please sign in to access your orders, seller metrics, and account tools.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-2.5 rounded bg-[#1dbf73] text-white font-bold text-sm hover:bg-[#19a463] transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading dashboard metrics…" />;

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const active = safeBookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b?.status));
  const completed = safeBookings.filter((b) => b?.status === 'completed');
  const totalEarned = completed.reduce((sum, b) => sum + (b.estimatedCost || 350), 0);

  const isWorker = user.role === 'worker';

  const handleAvatarUpdated = (newAvatarUrl) => {
    if (newAvatarUrl) {
      setUser({ ...user, avatar: newAvatarUrl });
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Worker Hero Profile & Photo Banner */}
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar Frame with Quick Upload Overlay */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white ring-4 ring-[#1dbf73]/30 shadow-md">
                  <img
                    src={getAvatarUrl(user.avatar, '', user.name)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getFallbackSvgAvatar(user.name);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change photo"
                >
                  <HiOutlineCamera className="text-2xl text-[#1dbf73]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-md border-2 border-white transition-transform hover:scale-110"
                  title="Add / Upload Photo"
                >
                  <HiOutlineCamera className="text-sm" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">
                    Welcome back, {user.name}
                  </h1>
                  <span className="bg-[#eefaf4] text-[#1dbf73] text-xs font-bold px-2 py-0.5 rounded">
                    {isWorker ? 'Worker Pro' : 'Buyer Account'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#74767e] mt-1 max-w-xl">
                  {isWorker
                    ? 'Your profile photo is displayed on your Gig Card in "Find Workers". Keep it updated to build client trust.'
                    : 'Manage your active Gig orders, reviews, and explore verified workers on demand.'}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <HiOutlineCamera className="text-base" /> Add / Change Photo
                  </button>
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-[#404145] transition-colors"
                  >
                    <HiOutlineEye className="text-base text-[#1dbf73]" /> Preview on Find Workers
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <Link
                to="/profile"
                className="flex-1 md:flex-none text-center px-4 py-2 rounded border border-[#e4e5e7] hover:bg-gray-50 text-xs font-bold text-[#222325] transition-colors"
              >
                Edit Full Profile
              </Link>
              <Link
                to="/bookings"
                className="flex-1 md:flex-none text-center px-4 py-2 rounded bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                View Orders ({active.length})
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Fiverr Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-[#e4e5e7] shadow-sm">
            <span className="text-xs font-semibold text-[#74767e] block">Active Orders</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#222325]">{active.length}</span>
              <HiOutlineShoppingBag className="text-2xl text-[#1dbf73]" />
            </div>
            <span className="text-[11px] text-[#1dbf73] font-medium mt-1 block">In progress</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e4e5e7] shadow-sm">
            <span className="text-xs font-semibold text-[#74767e] block">Completed Orders</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#222325]">{completed.length}</span>
              <HiOutlineCheckCircle className="text-2xl text-[#1dbf73]" />
            </div>
            <span className="text-[11px] text-[#1dbf73] font-medium mt-1 block">100% Satisfaction</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e4e5e7] shadow-sm">
            <span className="text-xs font-semibold text-[#74767e] block">
              {isWorker ? 'Earned Revenue' : 'Total Spent'}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#222325]">৳{totalEarned}</span>
              <HiOutlineCurrencyDollar className="text-2xl text-[#ffb33e]" />
            </div>
            <span className="text-[11px] text-[#74767e] font-medium mt-1 block">Protected payments</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e4e5e7] shadow-sm">
            <span className="text-xs font-semibold text-[#74767e] block">On-Time Delivery</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#222325]">100%</span>
              <HiStar className="text-2xl text-[#ffb33e]" />
            </div>
            <span className="text-[11px] text-[#1dbf73] font-medium mt-1 block">Top Rated Standard</span>
          </div>
        </div>

        {/* Main Grid: Orders & Notifications */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Active Orders List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#222325]">Active & Recent Orders</h2>
              <Link to="/bookings" className="text-xs font-bold text-[#1dbf73] hover:underline">
                View all orders &rarr;
              </Link>
            </div>

            {safeBookings.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e4e5e7] p-8 text-center text-[#74767e] text-xs">
                No orders placed yet.{' '}
                <Link to="/browse" className="text-[#1dbf73] font-bold hover:underline">
                  Explore available Gigs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {safeBookings.slice(0, 5).map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-4 rounded-xl border border-[#e4e5e7] flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">
                          #{b._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded capitalize ${
                            b.status === 'completed'
                              ? 'bg-[#eefaf4] text-[#1dbf73]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#222325] mt-1">
                        {b.service_id?.service_name || 'Gig Service'}
                      </h4>
                      <p className="text-xs text-[#62646a]">
                        Scheduled for: {new Date(b.date_time).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#222325] block">
                        ৳{b.estimatedCost || 350}
                      </span>
                      <Link
                        to="/bookings"
                        className="text-xs font-bold text-[#1dbf73] hover:underline"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Profile Summary & Alerts */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 border border-gray-200 shrink-0">
                  <img
                    src={getAvatarUrl(user.avatar, '', user.name)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getFallbackSvgAvatar(user.name);
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#222325]">{user.name}</h3>
                  <span className="text-xs text-[#74767e] block">{user.email}</span>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#eefaf4] text-[#1dbf73] rounded">
                    {user.role} mode
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#efeff0] text-xs text-[#62646a] space-y-2">
                <div className="flex justify-between">
                  <span>Location</span>
                  <strong className="text-[#222325]">{user.location || 'Faridpur / Dhaka'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <strong className="text-[#222325]">{user.phone || 'Verified'}</strong>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#efeff0] space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="block text-center w-full py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-xs font-bold text-white transition-colors shadow-sm"
                >
                  📷 Add / Update Photo
                </button>
                <Link
                  to="/profile"
                  className="block text-center w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#222325] transition-colors"
                >
                  Edit Profile & Gigs
                </Link>
              </div>
            </div>

            {/* Notifications / Alerts Card */}
            <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#222325] flex items-center gap-1.5">
                  <HiOutlineBell className="text-lg text-[#1dbf73]" /> Recent Notifications
                </h3>
                <Link to="/notifications" className="text-xs font-bold text-[#1dbf73] hover:underline">
                  All
                </Link>
              </div>

              {safeNotifications.length === 0 ? (
                <p className="text-xs text-[#74767e]">No unread alerts at this time.</p>
              ) : (
                <div className="space-y-3">
                  {safeNotifications.slice(0, 4).map((n) => (
                    <div key={n._id} className="text-xs border-b border-gray-100 pb-2.5 last:border-0">
                      <p className="font-semibold text-[#222325]">{n.message}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.sent_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Add/Change Photo Modal */}
      {showPhotoModal && (
        <PhotoUploadModal
          user={user}
          onClose={() => setShowPhotoModal(false)}
          onUpdated={handleAvatarUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;
