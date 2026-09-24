import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';
import { getWorkerPackages } from '../utils/demoData';

const GigCard = ({ worker, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const avatarUrl = worker.avatar || worker.profileImage || worker.user_id?.avatar;
  const packages = getWorkerPackages(worker);
  const startingPrice = packages.basic?.price || 350;

  // Primary cover image for the gig (prioritize worker custom avatar if uploaded, or gig gallery)
  const coverImage =
    !coverError && avatarUrl
      ? getAvatarUrl(avatarUrl, worker.service_type, worker.user_id?.name)
      : worker.gigImages?.[0]
      ? worker.gigImages[0]
      : getAvatarUrl(avatarUrl, worker.service_type, worker.user_id?.name);

  const gigTitle =
    worker.gigTitle ||
    `I will provide professional ${worker.service_type || 'craftsman'} services and reliable repairs`;

  const sellerLevel = worker.sellerLevel || (worker.isVerified ? 'Top Rated Seller' : 'Level 2 Seller');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-white rounded-lg border border-[#e4e5e7] hover:border-[#dadbdd] hover:shadow-fiverrHover transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Gig Image Header */}
      <Link to={`/workers/${worker._id}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={gigTitle}
          onError={() => setCoverError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Pro / Top Rated Badge */}
        {worker.isVerified && (
          <span className="absolute top-2.5 left-2.5 bg-[#003912]/85 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73]" />
            PRO VERIFIED
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 shadow-sm transition-all"
          title="Save to list"
        >
          {isLiked ? (
            <HiHeart className="text-red-500 text-lg" />
          ) : (
            <HiOutlineHeart className="text-lg" />
          )}
        </button>
      </Link>

      {/* Gig Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller Row */}
          <div className="flex items-center gap-2.5 mb-2">
            <Link
              to={`/workers/${worker._id}`}
              className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-200"
            >
              <img
                src={
                  imgError
                    ? getFallbackSvgAvatar(worker.user_id?.name)
                    : getAvatarUrl(avatarUrl, worker.service_type, worker.user_id?.name)
                }
                alt={worker.user_id?.name || 'Worker'}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </Link>
            <div className="min-w-0">
              <Link
                to={`/workers/${worker._id}`}
                className="text-xs font-semibold text-[#222325] hover:underline block truncate"
              >
                {worker.user_id?.name || 'Pro Worker'}
              </Link>
              <span className="text-[11px] text-[#74767e] block truncate font-medium">
                {sellerLevel}
              </span>
            </div>
          </div>

          {/* Gig Title */}
          <Link
            to={`/workers/${worker._id}`}
            className="text-[14px] leading-snug font-normal text-[#222325] hover:text-[#1dbf73] line-clamp-2 transition-colors block mb-2 min-h-[2.5rem]"
          >
            {gigTitle}
          </Link>

          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-xs text-[#222325] font-semibold mb-3">
            <HiStar className="text-[#ffb33e] text-sm shrink-0" />
            <span>{Number(worker.rating || 5.0).toFixed(1)}</span>
            <span className="text-[#74767e] font-normal">
              ({worker.ratingCount || worker.completedJobs || 12})
            </span>
          </div>
        </div>

        {/* Footer / Pricing Row */}
        <div className="pt-2.5 border-t border-[#efeff0] flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#74767e] font-semibold">
            STARTING AT
          </span>
          <span className="text-base font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
            ৳{startingPrice}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
