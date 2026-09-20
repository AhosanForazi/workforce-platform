import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineBadgeCheck,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCamera,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';
import { DEMO_WORKERS } from '../utils/demoData';

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
      if (res && (res.profile || res._id)) {
        const profileObj = res.profile || res;
        setData({
          profile: profileObj,
          offers: res.offers || profileObj.offers || [],
          availability: res.availability || profileObj.availability || [],
        });
        setSelectedOffer(res.offers?.[0] || profileObj.offers?.[0] || null);
        const { data: rev } = await api.get(`/reviews/worker/${id}`).catch(() => ({ data: [] }));
        setReviews(Array.isArray(rev) ? rev : []);
      } else {
        throw new Error('Worker not found');
      }
    } catch (e) {
      console.warn('Could not load worker from API, checking demo workers:', e.message);
      const demoMatch = DEMO_WORKERS.find((w) => w._id === id);
      if (demoMatch) {
        setData({
          profile: demoMatch,
          offers: demoMatch.offers || [],
          availability: demoMatch.availability || [],
        });
        setSelectedOffer(demoMatch.offers?.[0] || null);
        setReviews([]);
      } else {
        setData(null);
      }
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

  const { user } = useAuth();
  const { profile, offers, availability } = data;
  const avatarUrl = profile.avatar || profile.profileImage || profile.user_id?.avatar;
  const isOwnProfile =
    user &&
    (user.id === profile.user_id?._id ||
      user._id === profile.user_id?._id ||
      user.id === profile.user_id?.id ||
      user.id === profile.userId ||
      user._id === profile.userId);
  const hasCustomAvatar = Boolean(profile.avatar || profile.profileImage || profile.user_id?.avatar);
  const imageSrc = imgError
    ? getFallbackSvgAvatar(profile.user_id?.name)
    : getAvatarUrl(avatarUrl, profile.service_type, profile.user_id?.name);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2">
          <div className="ticket p-7 shadow-card">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Worker Profile Image with Round Shape Frame */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-concrete ring-4 ring-hazard/50 shadow-ticket bg-dispatch flex items-center justify-center relative group">
                  <img
                    src={imageSrc}
                    alt={profile.user_id?.name || 'Worker avatar'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />

                  {/* If viewing own profile, hover overlay to update photo */}
                  {isOwnProfile && (
                    <Link
                      to="/profile"
                      className="absolute inset-0 rounded-full bg-ink/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      title="Update your worker profile photo"
                    >
                      <HiOutlineCamera className="text-3xl text-hazard mb-1" />
                      <span className="text-[10px] font-bold font-mono tracking-wider">CHANGE PHOTO</span>
                    </Link>
                  )}
                </div>

                {/* Verified worker badge pinned on round frame */}
                {profile.isVerified && (
                  <span
                    className="absolute bottom-1 right-1 p-1.5 rounded-full bg-signal text-white border-2 border-concrete shadow-md"
                    title="Verified worker"
                  >
                    <HiOutlineBadgeCheck className="text-xl" />
                  </span>
                )}

                {/* Owner shortcut badge pinned on round frame */}
                {isOwnProfile && (
                  <Link
                    to="/profile"
                    className="absolute -top-1 -right-1 p-2 rounded-full bg-hazard text-ink border-2 border-concrete shadow-md hover:scale-110 transition-transform"
                    title="Edit profile & photo"
                  >
                    <HiOutlineCamera className="text-base" />
                  </Link>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-display font-bold text-3xl sm:text-4xl flex items-center gap-2">
                    {profile.user_id?.name}
                    {profile.isVerified && (
                      <HiOutlineBadgeCheck className="text-signal text-2xl inline-block" title="Verified worker" />
                    )}
                  </h1>
                </div>

                <p className="text-hazard font-mono text-sm uppercase tracking-wider mt-1.5 font-bold">
                  {profile.service_type}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-ink/70">
                  <RatingStars rating={profile.rating} count={profile.ratingCount} size="text-base" />
                  <span className="flex items-center gap-1">
                    <HiOutlineLocationMarker /> {profile.user_id?.location || 'Location not specified'}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineBriefcase /> {profile.completedJobs} jobs completed
                  </span>
                </div>

                {/* Owner helpful banner */}
                {isOwnProfile && !hasCustomAvatar && (
                  <div className="mt-4 p-3 rounded-xl bg-hazard/15 border border-hazard/40 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-ink font-medium">
                      📸 You are currently using a default trade photo. Add your personal photo to stand out!
                    </span>
                    <Link
                      to="/profile"
                      className="px-3 py-1.5 rounded-lg bg-ink text-concrete font-bold hover:bg-hazard hover:text-ink transition-colors shrink-0"
                    >
                      Upload Custom Photo
                    </Link>
                  </div>
                )}
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
