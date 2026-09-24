import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiCheck,
  HiOutlineCreditCard,
  HiOutlineCash,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';
import { GIG_EXTRAS } from '../utils/demoData';

const BookingModal = ({
  worker,
  offer,
  selectedPackage,
  selectedExtras: initialExtras = [],
  totalPrice: initialTotalPrice,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeExtras, setActiveExtras] = useState(initialExtras || []);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'card' | 'wallet'
  const [form, setForm] = useState({
    date_time: '',
    address: user?.location || '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Compute pricing
  const packagePrice = selectedPackage?.price || offer?.fixed_price || offer?.hourly_rate || 350;
  const extrasTotal = activeExtras.reduce((sum, extraId) => {
    const extra = GIG_EXTRAS.find((e) => e.id === extraId);
    return sum + (extra ? extra.price : 0);
  }, 0);
  const serviceFee = Math.round((packagePrice + extrasTotal) * 0.05); // 5% marketplace protection fee
  const finalTotal = packagePrice + extrasTotal + serviceFee;

  const workerAvatarUrl = worker.avatar || worker.profileImage || worker.user_id?.avatar;
  const gigTitle =
    worker.gigTitle ||
    `I will provide professional ${worker.service_type || 'craftsman'} services and reliable repairs`;

  const toggleExtra = (extraId) => {
    setActiveExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to place an order.');
      navigate('/login');
      return;
    }
    if (user.role === 'worker' && (user.id === worker.userId || user._id === worker._id)) {
      toast.error('You cannot order your own Gig.');
      return;
    }

    setSubmitting(true);

    // Format rich Fiverr order summary into notes
    const extrasList = activeExtras
      .map((id) => GIG_EXTRAS.find((e) => e.id === id)?.title)
      .filter(Boolean)
      .join(', ');

    const richOrderNotes = [
      `[Fiverr Gig Order]`,
      `Package: ${selectedPackage?.tier ? selectedPackage.tier.toUpperCase() : 'STANDARD'} (৳${packagePrice})`,
      extrasList ? `Extras: ${extrasList}` : null,
      `Payment: ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online / Card'}`,
      `Requirements: ${form.notes || 'None specified'}`,
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      const payload = {
        worker_id: worker._id || worker.id,
        service_id:
          offer?.service_id?._id ||
          offer?.service_id?.id ||
          offer?.service_id ||
          'srv-1',
        date_time: form.date_time,
        address: form.address,
        notes: richOrderNotes,
        estimatedCost: finalTotal,
      };

      await api.post('/bookings', payload);
      toast.success('Order placed successfully! The worker has been notified.');
      onSuccess?.();
      onClose();
      navigate('/bookings');
    } catch (err) {
      // In demo mode without backend running, simulate order completion
      if (err.isHtmlFallback || err.message?.includes('Network Error') || !err.response) {
        toast.success('Order placed in Demo Mode! View it in Manage Orders.');
        onSuccess?.();
        onClose();
        navigate('/bookings');
      } else {
        toast.error(err.response?.data?.message || 'Could not place order');
      }
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
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden relative text-[#222325]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-[#efeff0] flex items-center justify-between bg-[#fafafa]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#222325]">
                Order Details
              </span>
              <span className="text-xs bg-[#eefaf4] text-[#1dbf73] font-bold px-2 py-0.5 rounded capitalize">
                {selectedPackage?.tier || 'Standard'} Package
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <HiOutlineX className="text-xl" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={submit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* Gig & Seller Info Banner */}
            <div className="p-4 rounded-lg bg-[#fafafa] border border-[#e4e5e7] flex gap-3.5 items-center">
              <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                <img
                  src={getAvatarUrl(workerAvatarUrl, worker?.service_type, worker?.user_id?.name)}
                  alt={worker?.user_id?.name || 'Worker'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackSvgAvatar(worker?.user_id?.name);
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-[#222325] line-clamp-1">{gigTitle}</h3>
                <p className="text-xs text-[#62646a] mt-0.5">
                  Worker: <strong>{worker.user_id?.name}</strong> · {worker.service_type}
                </p>
                <p className="text-xs text-[#1dbf73] font-semibold mt-0.5">
                  ⚡ {selectedPackage?.turnaround || '1 Day Delivery'}
                </p>
              </div>
            </div>

            {/* Customize with Extras */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#74767e] mb-2.5">
                Customize Your Order (Optional Extras)
              </h4>
              <div className="space-y-2">
                {GIG_EXTRAS.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:bg-gray-50/50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={activeExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="mt-0.5 rounded text-[#1dbf73] focus:ring-[#1dbf73]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-bold text-[#222325]">
                        <span>{extra.title}</span>
                        <span className="text-[#1dbf73]">+৳{extra.price}</span>
                      </div>
                      <p className="text-[#74767e] mt-0.5">{extra.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule & Address */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1.5">
                  Scheduled Service Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
                  <HiOutlineCalendar className="text-gray-400 text-lg" />
                  <input
                    required
                    type="datetime-local"
                    value={form.date_time}
                    onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                    className="w-full text-xs text-[#222325] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1.5">
                  Service Address / Location <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 border border-[#b5b6ba] focus-within:border-[#1dbf73] rounded-md px-3 py-2 bg-white">
                  <HiOutlineLocationMarker className="text-gray-400 text-lg" />
                  <input
                    required
                    type="text"
                    placeholder="House, road, area..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full text-xs text-[#222325] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Requirements */}
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5 flex items-center justify-between">
                <span>Order Requirements & Details</span>
                <span className="text-[10px] text-gray-400 font-normal">Optional</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe your issue or job in detail (e.g. 2 circuit breakers trip whenever AC turns on, please bring 32A breaker)..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#b5b6ba] focus:border-[#1dbf73] rounded-md p-3 text-xs text-[#222325] focus:outline-none resize-none"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#1dbf73] bg-[#eefaf4] text-[#1dbf73] font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <HiOutlineCash className="text-xl" />
                  <div>
                    <p className="text-xs">Cash on Completion</p>
                    <p className="text-[10px] text-gray-500 font-normal">Pay worker upon job sign-off</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#1dbf73] bg-[#eefaf4] text-[#1dbf73] font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <HiOutlineCreditCard className="text-xl" />
                  <div>
                    <p className="text-xs">Card / Mobile Banking</p>
                    <p className="text-[10px] text-gray-500 font-normal">bKash, Nagad or Card</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-lg bg-[#fafafa] border border-[#efeff0] space-y-2 text-xs">
              <div className="flex justify-between text-[#62646a]">
                <span>{selectedPackage?.name || 'Selected Package'}</span>
                <span>৳{packagePrice}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between text-[#62646a]">
                  <span>Selected Add-ons ({activeExtras.length})</span>
                  <span>+৳{extrasTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-[#62646a]">
                <span className="flex items-center gap-1">
                  Service & Buyer Protection Fee <HiOutlineShieldCheck className="text-[#1dbf73]" />
                </span>
                <span>৳{serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-[#222325]">
                <span>Total Due</span>
                <span className="text-[#1dbf73] text-base">৳{finalTotal}</span>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Placing Order…' : `Confirm & Place Order (৳${finalTotal})`}
              </button>
              <p className="text-[11px] text-center text-[#74767e] mt-2">
                🔒 You won't be charged until you inspect the completed work and approve.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
