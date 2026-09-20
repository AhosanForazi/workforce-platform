import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineBadgeCheck, HiOutlineBriefcase, HiOutlineCalendar } from 'react-icons/hi';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';
import { getAvatarUrl, getInitials } from '../utils/imageUrl';

const WorkerProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/workers/${id}`);
      setData(res);
      setSelectedOffer(res.offers?.[0] || null);
      const { data: rev } = await api.get(`/reviews/worker/${id}`);
      setReviews(rev);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner label="Pulling up the job ticket…" />;
  if (!data) return <div className="text-center py-24 text-ink/50">Worker not found.</div>;

  const { profile, offers, availability } = data;
  const avatarUrl = profile.avatar || profile.profileImage || profile.user_id?.avatar;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2">
          <div className="ticket p-7 shadow-card">
            <div className="flex items-start gap-5">
              {avatarUrl && !imgError ? (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-dispatch shrink-0 border-2 border-ink/10 shadow-card">
                  <img
                    src={getAvatarUrl(avatarUrl)}
                    alt={profile.user_id?.name || 'Worker avatar'}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-dispatch text-concrete flex items-center justify-center font-display font-bold text-3xl shrink-0">
                  {getInitials(profile.user_id?.name)}
                </div>
              )}
              <div className="flex-1">
                <h1 className="font-display font-bold text-3xl flex items-center gap-2">
                  {profile.user_id?.name}
                  {profile.isVerified && <HiOutlineBadgeCheck className="text-signal text-2xl" title="Verified worker" />}
                </h1>
                <p className="text-hazard font-mono text-sm uppercase tracking-wide mt-1">{profile.service_type}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink/60">
                  <RatingStars rating={profile.rating} count={profile.ratingCount} size="text-base" />
                  <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {profile.user_id?.location}</span>
                  <span className="flex items-center gap-1"><HiOutlineBriefcase /> {profile.completedJobs} jobs completed</span>
                </div>
              </div>
            </div>

            <p className="ticket-perf mt-6 pt-6 text-ink/70 leading-relaxed">{profile.bio}</p>

            {profile.skills?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-concrete text-xs font-semibold text-ink/70">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display font-bold text-2xl mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-ink/50 text-sm">No reviews yet — be the first to book and review this worker.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-panel rounded-xl p-5 border border-ink/5 shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{r.customer_id?.name}</span>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="text-sm text-ink/60">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="ticket p-6 shadow-ticket sticky top-24">
            <h3 className="font-display font-bold text-xl mb-4">Services & rates</h3>
            <div className="space-y-2 mb-5">
              {offers?.length > 0 ? offers.map((o) => (
                <button
                  key={o._id}
                  onClick={() => setSelectedOffer(o)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedOffer?._id === o._id ? 'border-hazard bg-hazard/10' : 'border-ink/10 hover:border-ink/30'
                  }`}
                >
                  <div className="flex justify-between font-semibold text-sm">
                    <span>{o.service_id?.service_name}</span>
                    <span className="font-mono">{o.hourly_rate ? `৳${o.hourly_rate}/hr` : o.fixed_price ? `৳${o.fixed_price}` : 'TBD'}</span>
                  </div>
                </button>
              )) : <p className="text-sm text-ink/50">No listed services yet.</p>}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors"
            >
              Book this worker
            </button>

            <div className="ticket-perf mt-5 pt-5">
              <h4 className="font-display font-bold text-sm mb-2 flex items-center gap-1"><HiOutlineCalendar /> Weekly availability</h4>
              <ul className="text-sm text-ink/60 space-y-1">
                {availability?.length > 0 ? availability.map((a) => (
                  <li key={a._id} className="flex justify-between">
                    <span>{a.day_of_week}</span>
                    <span className="font-mono">{a.start_time}–{a.end_time}</span>
                  </li>
                )) : <li>Contact worker for availability.</li>}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <BookingModal
          worker={profile}
          offer={selectedOffer}
          onClose={() => setShowModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
};

export default WorkerProfilePage;
