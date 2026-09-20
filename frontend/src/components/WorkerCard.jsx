import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineBadgeCheck, HiOutlineBriefcase } from 'react-icons/hi';
import RatingStars from './RatingStars';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';

const WorkerCard = ({ worker, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = worker.avatar || worker.profileImage || worker.user_id?.avatar;
  const offer = worker.offers?.[0];
  const priceLabel = offer
    ? offer.hourly_rate
      ? `৳${offer.hourly_rate}/hr`
      : offer.fixed_price
      ? `৳${offer.fixed_price} fixed`
      : 'Rate on request'
    : 'Rate on request';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.06, 0.4) }}
      className="ticket group relative bg-panel rounded-2xl shadow-card border border-ink/5 overflow-hidden hover:-translate-y-1.5 hover:shadow-ticket transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            {/* Round Shape Worker Card Avatar Frame */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-dispatch shrink-0 border-2 border-panel ring-2 ring-hazard/40 shadow-sm relative group-hover:ring-hazard group-hover:scale-105 transition-all">
              <img
                src={
                  imgError
                    ? getFallbackSvgAvatar(worker.user_id?.name)
                    : getAvatarUrl(avatarUrl, worker.service_type, worker.user_id?.name)
                }
                alt={worker.user_id?.name || 'Worker'}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl leading-tight flex items-center gap-1.5">
                {worker.user_id?.name}
                {worker.isVerified && <HiOutlineBadgeCheck className="text-signal text-lg" title="Verified" />}
              </h3>
              <p className="text-xs text-hazard font-mono uppercase tracking-wide font-semibold">{worker.service_type}</p>
            </div>
          </div>
          <span className="stamp text-hazard text-[10px] font-bold px-2 py-0.5">{worker.experience}</span>
        </div>

        <p className="mt-4 text-sm text-ink/60 line-clamp-2 min-h-[2.5rem]">{worker.bio || 'Experienced professional ready to help with your job.'}</p>

        <div className="ticket-perf mt-4 pt-4 flex items-center justify-between text-sm">
          <RatingStars rating={worker.rating} count={worker.ratingCount} />
          <div className="flex items-center gap-1 text-ink/50 text-xs">
            <HiOutlineLocationMarker />
            {worker.user_id?.location || 'Location N/A'}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-bold font-mono text-dispatch">
            <HiOutlineBriefcase /> {priceLabel}
          </div>
          <Link
            to={`/workers/${worker._id}`}
            className="px-4 py-2 rounded-lg bg-ink text-concrete text-sm font-bold group-hover:bg-hazard group-hover:text-ink transition-colors"
          >
            View & Book
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerCard;
