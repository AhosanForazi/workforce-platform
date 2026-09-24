import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiStar,
  HiOutlineUserCircle,
  HiOutlineRefresh,
  HiOutlineShoppingBag,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineX,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';

const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'in_progress',
  in_progress: 'completed',
};

const STATUS_CONFIG = {
  pending: { label: 'PENDING APPROVAL', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  accepted: { label: 'ORDER ACCEPTED', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  in_progress: { label: 'IN PROGRESS', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  completed: { label: 'COMPLETED', bg: 'bg-[#eefaf4]', text: 'text-[#1dbf73]', border: 'border-[#1dbf73]/30' },
  cancelled: { label: 'CANCELLED', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const ReviewModal = ({ booking, onClose, onDone }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!comment.trim()) {
      toast.error('Please share a brief comment about the service.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        booking_id: booking._id,
        rating,
        comment,
      });
      toast.success('Public review submitted — thank you!');
      onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-[#222325] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded"
        >
          <HiOutlineX className="text-xl" />
        </button>

        <h3 className="font-extrabold text-xl mb-1">Rate your Experience</h3>
        <p className="text-xs text-[#62646a] mb-5">
          How was the quality of work delivered by{' '}
          <strong>{booking.worker_id?.user_id?.name || 'the worker'}</strong>?
        </p>

        {/* 5-Star Selector */}
        <div className="flex items-center gap-2 mb-4 justify-center py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <HiStar
                className={`text-3xl ${
                  star <= (hoverRating || rating) ? 'text-[#ffb33e]' : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-xs font-bold text-[#404145] mb-4">
          {rating === 5 && 'Outstanding Experience (5/5)'}
          {rating === 4 && 'Very Good (4/5)'}
          {rating === 3 && 'Average (3/5)'}
          {rating === 2 && 'Needs Improvement (2/5)'}
          {rating === 1 && 'Poor Experience (1/5)'}
        </p>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did the worker do well? Was the job completed on time and as described?"
          className="w-full border border-gray-300 focus:border-[#1dbf73] rounded-lg p-3 text-xs text-[#222325] focus:outline-none resize-none mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={submit}
            className="px-6 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const [reviewBooking, setReviewBooking] = useState(null);

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not load live bookings, checking sample/local state:', err.message);
      setLoadError(err.message || 'Could not load your bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const advance = async (booking) => {
    try {
      await api.put(`/bookings/${booking._id}/status`, { status: NEXT_STATUS[booking.status] });
      toast.success('Order status updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const cancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/bookings/${booking._id}/status`, {
        status: 'cancelled',
        cancellation_reason: 'Cancelled by customer',
      });
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (!user && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-[#e4e5e7] rounded-xl p-8 shadow-sm space-y-4">
          <HiOutlineShoppingBag className="text-5xl text-[#1dbf73] mx-auto" />
          <h2 className="font-extrabold text-2xl text-[#222325]">Sign in to View Orders</h2>
          <p className="text-xs text-[#62646a]">
            Please sign in to track your active Gig deliveries, manage orders, and leave reviews.
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

  if (loading) return <LoadingSpinner label="Loading your orders…" />;

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Filter by tabs
  const filteredBookings = safeBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'accepted', 'in_progress'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">Manage Orders</h1>
            <p className="text-xs sm:text-sm text-[#74767e] mt-1">
              View and track all your active Gig requests, scheduled arrival times, and status.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            + Browse More Gigs
          </Link>
        </div>

        {/* Status Notice if any */}
        {loadError && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-800">
            <span>
              <strong>Note:</strong> {loadError}
            </span>
            <button
              onClick={load}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-amber-200/80 font-bold hover:bg-amber-300 transition-colors"
            >
              <HiOutlineRefresh /> Refresh
            </button>
          </div>
        )}

        {/* Fiverr-style Tabs */}
        <div className="flex items-center gap-2 border-b border-[#dadbdd] pb-1 mb-6 overflow-x-auto scrollbar-none text-xs font-bold">
          {[
            { id: 'all', label: `ALL ORDERS (${safeBookings.length})` },
            {
              id: 'active',
              label: `ACTIVE (${
                safeBookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status)).length
              })`,
            },
            {
              id: 'completed',
              label: `COMPLETED (${safeBookings.filter((b) => b.status === 'completed').length})`,
            },
            {
              id: 'cancelled',
              label: `CANCELLED (${safeBookings.filter((b) => b.status === 'cancelled').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 rounded-t transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#1dbf73] text-[#1dbf73] font-extrabold'
                  : 'text-[#74767e] hover:text-[#222325]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e4e5e7] p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl text-gray-400 mx-auto">
              <HiOutlineShoppingBag />
            </div>
            <h3 className="text-lg font-bold text-[#222325]">No orders found</h3>
            <p className="text-xs text-[#74767e] max-w-sm mx-auto">
              You do not have any orders in this category. Search for a verified electrician, plumber, or painter to get started.
            </p>
            <div>
              <Link
                to="/browse"
                className="inline-block px-6 py-2.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors"
              >
                Find Services Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b, i) => {
              const statusCfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
              const isCustomer = user.role === 'customer';
              const otherPartyName = isCustomer
                ? b.worker_id?.user_id?.name || 'Worker'
                : b.customer_id?.name || 'Client';

              const otherPartyAvatar = isCustomer
                ? b.worker_id?.avatar || b.worker_id?.profileImage || b.worker_id?.user_id?.avatar
                : b.customer_id?.avatar;

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.25) }}
                  className="bg-white rounded-xl border border-[#e4e5e7] p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#efeff0]">
                    {/* Gig / Party Info */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={getAvatarUrl(otherPartyAvatar, b.service_id?.service_name, otherPartyName)}
                          alt={otherPartyName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getFallbackSvgAvatar(otherPartyName);
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400">
                            ORDER #{b._id.slice(-6).toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#222325] mt-0.5">
                          {b.service_id?.service_name || 'Service Package'}
                        </h3>
                        <p className="text-xs text-[#62646a]">
                          {isCustomer ? 'Seller:' : 'Buyer:'} <strong>{otherPartyName}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                        Total Price
                      </span>
                      <span className="text-xl font-extrabold text-[#222325]">
                        ৳{b.estimatedCost || 350}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Details & Location */}
                  <div className="py-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#62646a] items-center">
                    <span className="flex items-center gap-1.5 font-medium">
                      <HiOutlineCalendar className="text-base text-gray-400" />
                      {new Date(b.date_time).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <HiOutlineLocationMarker className="text-base text-gray-400" />
                      {b.address || 'Address provided upon confirmation'}
                    </span>
                  </div>

                  {/* Order Notes / Package breakdown */}
                  {b.notes && (
                    <div className="p-3 rounded-lg bg-[#fafafa] border border-gray-100 text-xs text-[#404145] mb-4">
                      <span className="font-bold text-gray-500 mr-1.5">Scope & Requirements:</span>
                      <span>{b.notes}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#efeff0]">
                    <div className="flex items-center gap-2">
                      {b.status === 'completed' && !b.review && (
                        <button
                          onClick={() => setReviewBooking(b)}
                          className="px-4 py-2 rounded bg-[#ffb33e] hover:bg-[#f0a32e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <HiStar className="text-base" /> Rate & Review Worker
                        </button>
                      )}
                      {b.status === 'completed' && b.review && (
                        <span className="text-xs text-[#1dbf73] font-bold flex items-center gap-1">
                          <HiOutlineCheckCircle className="text-base" /> Reviewed ({b.review.rating}★)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Advance workflow buttons */}
                      {b.status === 'pending' && user.role === 'worker' && (
                        <button
                          onClick={() => advance(b)}
                          className="px-4 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          Accept Order
                        </button>
                      )}

                      {b.status === 'accepted' && (
                        <button
                          onClick={() => advance(b)}
                          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                        >
                          Start Job
                        </button>
                      )}

                      {b.status === 'in_progress' && (
                        <button
                          onClick={() => advance(b)}
                          className="px-4 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                        >
                          <HiOutlineCheckCircle className="text-base" /> Mark as Completed
                        </button>
                      )}

                      {['pending', 'accepted'].includes(b.status) && (
                        <button
                          onClick={() => cancel(b)}
                          className="px-3 py-2 rounded border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs font-semibold text-gray-600 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onDone={load}
        />
      )}
    </div>
  );
};

export default MyBookings;
