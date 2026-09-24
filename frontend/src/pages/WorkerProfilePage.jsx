import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiStar,
  HiOutlineClock,
  HiOutlineRefresh,
  HiCheck,
  HiOutlineShieldCheck,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
  HiOutlineCamera,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getFallbackSvgAvatar } from '../utils/imageUrl';
import { DEMO_WORKERS, getWorkerPackages, GIG_EXTRAS } from '../utils/demoData';

const WorkerProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standard'); // 'basic' | 'standard' | 'premium'
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
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
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading Gig details…" />;
  if (!data) return <div className="text-center py-24 text-gray-500 font-medium">Gig not found.</div>;

  const { profile, offers, availability } = data;
  const packages = getWorkerPackages(profile);
  const currentPackage = packages[activeTab] || packages.standard;

  // Selected extras total
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = GIG_EXTRAS.find((e) => e.id === extraId);
    return sum + (extra ? extra.price : 0);
  }, 0);

  const totalPrice = currentPackage.price + extrasTotal;

  // Images for gig gallery
  const avatarUrl = profile.avatar || profile.profileImage || profile.user_id?.avatar;
  const gigImages =
    profile.gigImages && profile.gigImages.length > 0
      ? profile.gigImages
      : [
          getAvatarUrl(avatarUrl, profile.service_type, profile.user_id?.name),
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
        ];

  const gigTitle =
    profile.gigTitle ||
    `I will provide professional ${profile.service_type || 'craftsman'} services and reliable repairs`;

  const sellerLevel = profile.sellerLevel || (profile.isVerified ? 'Top Rated Seller' : 'Level 2 Seller');
  const ordersInQueue = profile.ordersInQueue || 3;

  const toggleExtra = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const isOwnProfile =
    user &&
    (user.id === profile.user_id?._id ||
      user._id === profile.user_id?._id ||
      user.id === profile.user_id?.id ||
      user.id === profile.userId ||
      user._id === profile.userId);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#efeff0] bg-[#fafafa] py-3 text-xs text-[#74767e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#1dbf73]">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-[#1dbf73]">Services</Link>
          <span>/</span>
          <Link to={`/browse?service=${profile.service_type}`} className="hover:text-[#1dbf73] font-medium text-[#222325]">
            {profile.service_type}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* LEFT 8 COLUMNS: Gig Overview, Gallery, About Gig, Compare Packages, About Seller, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gig Title & Seller Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] leading-tight">
                {gigTitle}
              </h1>

              {/* Seller Row Bar (Fiverr Style) */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#62646a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
                    <img
                      src={
                        imgError
                          ? getFallbackSvgAvatar(profile.user_id?.name)
                          : getAvatarUrl(avatarUrl, profile.service_type, profile.user_id?.name)
                      }
                      alt={profile.user_id?.name}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[#222325] hover:underline cursor-pointer">
                      {profile.user_id?.name}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs font-semibold text-[#1dbf73]">{sellerLevel}</span>
                  </div>
                </div>

                <span className="text-gray-300 hidden sm:inline">|</span>

                {/* Rating */}
                <div className="flex items-center gap-1 font-bold text-[#222325]">
                  <HiStar className="text-[#ffb33e] text-base" />
                  <span>{Number(profile.rating || 4.9).toFixed(1)}</span>
                  <span className="text-[#74767e] font-normal">
                    ({profile.ratingCount || profile.completedJobs || 48} reviews)
                  </span>
                </div>

                <span className="text-gray-300 hidden sm:inline">|</span>

                {/* Orders in queue */}
                <span className="text-xs font-medium text-[#74767e]">
                  {ordersInQueue} Orders in Queue
                </span>
              </div>
            </div>

            {/* Photo Gallery (Fiverr Showcase) */}
            <div className="space-y-3">
              <div className="aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#e4e5e7] bg-gray-100 relative shadow-sm">
                <img
                  src={gigImages[activeImageIdx]}
                  alt="Gig Showcase"
                  className="w-full h-full object-cover"
                />
                {profile.isVerified && (
                  <span className="absolute top-3 left-3 bg-[#003912]/85 text-white text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1dbf73]" />
                    VERIFIED GIG
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {gigImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {gigImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIdx === idx
                          ? 'border-[#1dbf73] shadow-md scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About This Gig Section */}
            <div className="border-t border-[#efeff0] pt-6">
              <h2 className="text-xl font-bold text-[#222325] mb-4">About this Gig</h2>
              <div className="text-sm text-[#404145] leading-relaxed space-y-4">
                <p>
                  Welcome to my professional <strong>{profile.service_type}</strong> service! With over{' '}
                  <strong>{profile.experience || '5+ years'}</strong> of dedicated hands-on experience, I deliver
                  clean, dependable, and precision-engineered solutions for residential and commercial spaces.
                </p>
                <p>{profile.bio}</p>

                <h3 className="font-bold text-[#222325] text-base pt-2">Why hire this Gig?</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-[#62646a]">
                  <li>Certified, background-verified master technician.</li>
                  <li>Arrives fully equipped with industrial testing gear, power tools, and standard components.</li>
                  <li>Transparent fixed-tier packages with zero hidden fees.</li>
                  <li>Written workmanship warranty with free follow-up inspection.</li>
                  <li>Post-job cleanup and complete safety diagnostic walk-through.</li>
                </ul>
              </div>

              {profile.skills?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase text-[#74767e] tracking-wider mb-2.5">
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-[#f7f7f7] border border-[#e4e5e7] text-xs font-semibold text-[#404145]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compare Packages Table (Fiverr Style) */}
            <div className="border-t border-[#efeff0] pt-8">
              <h2 className="text-xl font-bold text-[#222325] mb-4">Compare Packages</h2>
              <div className="overflow-x-auto border border-[#e4e5e7] rounded-lg">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-[#e4e5e7]">
                      <th className="p-4 font-bold text-[#222325] w-1/4">Package</th>
                      <th className="p-4 font-bold text-[#222325] w-1/4">
                        Basic
                        <span className="block text-base text-[#1dbf73] font-extrabold mt-0.5">
                          ৳{packages.basic.price}
                        </span>
                      </th>
                      <th className="p-4 font-bold text-[#222325] w-1/4 bg-[#eefaf4]/50 border-x border-[#1dbf73]/30">
                        Standard <span className="text-[10px] font-bold bg-[#1dbf73] text-white px-1.5 py-0.2 rounded ml-1">POPULAR</span>
                        <span className="block text-base text-[#1dbf73] font-extrabold mt-0.5">
                          ৳{packages.standard.price}
                        </span>
                      </th>
                      <th className="p-4 font-bold text-[#222325] w-1/4">
                        Premium
                        <span className="block text-base text-[#1dbf73] font-extrabold mt-0.5">
                          ৳{packages.premium.price}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efeff0] text-xs">
                    <tr>
                      <td className="p-4 font-semibold text-[#74767e]">Scope</td>
                      <td className="p-4 text-[#404145]">{packages.basic.name}</td>
                      <td className="p-4 text-[#404145] bg-[#eefaf4]/30 border-x border-[#1dbf73]/20 font-medium">
                        {packages.standard.name}
                      </td>
                      <td className="p-4 text-[#404145]">{packages.premium.name}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#74767e]">Turnaround</td>
                      <td className="p-4 text-[#404145]">{packages.basic.turnaround}</td>
                      <td className="p-4 text-[#404145] bg-[#eefaf4]/30 border-x border-[#1dbf73]/20 font-medium">
                        {packages.standard.turnaround}
                      </td>
                      <td className="p-4 text-[#404145]">{packages.premium.turnaround}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#74767e]">Warranty & Follow-up</td>
                      <td className="p-4 text-[#404145]">{packages.basic.revisions}</td>
                      <td className="p-4 text-[#404145] bg-[#eefaf4]/30 border-x border-[#1dbf73]/20 font-medium">
                        {packages.standard.revisions}
                      </td>
                      <td className="p-4 text-[#404145]">{packages.premium.revisions}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#74767e]">Select</td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setActiveTab('basic');
                            setShowModal(true);
                          }}
                          className="w-full py-2 rounded bg-gray-100 hover:bg-[#1dbf73] hover:text-white font-bold text-xs transition-colors"
                        >
                          Select Basic
                        </button>
                      </td>
                      <td className="p-4 bg-[#eefaf4]/30 border-x border-[#1dbf73]/20">
                        <button
                          onClick={() => {
                            setActiveTab('standard');
                            setShowModal(true);
                          }}
                          className="w-full py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          Select Standard
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setActiveTab('premium');
                            setShowModal(true);
                          }}
                          className="w-full py-2 rounded bg-gray-100 hover:bg-[#1dbf73] hover:text-white font-bold text-xs transition-colors"
                        >
                          Select Premium
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* About The Seller Box (Fiverr Profile Details) */}
            <div className="border-t border-[#efeff0] pt-8">
              <h2 className="text-xl font-bold text-[#222325] mb-4">About the Seller</h2>
              <div className="border border-[#e4e5e7] rounded-xl p-6 bg-white space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-200 shrink-0">
                    <img
                      src={
                        imgError
                          ? getFallbackSvgAvatar(profile.user_id?.name)
                          : getAvatarUrl(avatarUrl, profile.service_type, profile.user_id?.name)
                      }
                      alt={profile.user_id?.name}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#222325]">{profile.user_id?.name}</h3>
                    <p className="text-xs text-[#74767e] font-medium">{profile.service_type} · {sellerLevel}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#222325]">
                      <HiStar className="text-[#ffb33e]" />
                      <span>{Number(profile.rating || 4.9).toFixed(1)}</span>
                      <span className="text-[#74767e] font-normal">
                        ({profile.ratingCount || profile.completedJobs || 24} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#fafafa] border border-[#efeff0] text-xs">
                  <div>
                    <span className="text-[#74767e] block">From</span>
                    <span className="font-bold text-[#222325]">{profile.user_id?.location || 'Faridpur / Dhaka'}</span>
                  </div>
                  <div>
                    <span className="text-[#74767e] block">Member since</span>
                    <span className="font-bold text-[#222325]">May 2023</span>
                  </div>
                  <div>
                    <span className="text-[#74767e] block">Avg. response time</span>
                    <span className="font-bold text-[#222325]">1 Hour</span>
                  </div>
                  <div>
                    <span className="text-[#74767e] block">Completed jobs</span>
                    <span className="font-bold text-[#222325]">{profile.completedJobs || 45}+</span>
                  </div>
                </div>

                <p className="text-sm text-[#404145] leading-relaxed">{profile.bio}</p>
              </div>
            </div>

            {/* FAQ Accordion */}
            {profile.faq?.length > 0 && (
              <div className="border-t border-[#efeff0] pt-8">
                <h2 className="text-xl font-bold text-[#222325] mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {profile.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-[#e4e5e7] rounded-lg overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-[#222325] hover:bg-gray-50"
                      >
                        <span>{item.q}</span>
                        {expandedFaq === idx ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                      </button>
                      {expandedFaq === idx && (
                        <div className="p-4 pt-0 text-xs text-[#62646a] leading-relaxed border-t border-gray-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div className="border-t border-[#efeff0] pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#222325]">
                    Reviews ({reviews.length > 0 ? reviews.length : profile.ratingCount || 18})
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-[#222325]">
                    <div className="flex text-[#ffb33e]">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} />
                      ))}
                    </div>
                    <span>{Number(profile.rating || 4.9).toFixed(1)} out of 5</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div key={r._id} className="p-4 rounded-lg border border-[#e4e5e7] bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#222325]">
                          {r.customer_id?.name || 'Verified Buyer'}
                        </span>
                        <div className="flex text-[#ffb33e] text-xs">
                          {[...Array(Math.round(r.rating || 5))].map((_, i) => (
                            <HiStar key={i} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#62646a] leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    {/* Realistic sample reviews */}
                    <div className="p-4 rounded-lg border border-[#e4e5e7] bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#222325]">Tanvir Hasan</span>
                          <span className="text-[11px] text-[#1dbf73] font-semibold flex items-center gap-0.5">
                            <HiOutlineCheckCircle /> Verified Booking
                          </span>
                        </div>
                        <div className="flex text-[#ffb33e] text-xs">
                          <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
                        </div>
                      </div>
                      <p className="text-xs text-[#62646a] leading-relaxed">
                        Arrived right on time with high-grade replacement parts. Fixed our living room switchboard and circuit trip in under 45 minutes. Super polite and professional!
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-[#e4e5e7] bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#222325]">Farzana Chowdhury</span>
                          <span className="text-[11px] text-[#1dbf73] font-semibold flex items-center gap-0.5">
                            <HiOutlineCheckCircle /> Verified Booking
                          </span>
                        </div>
                        <div className="flex text-[#ffb33e] text-xs">
                          <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
                        </div>
                      </div>
                      <p className="text-xs text-[#62646a] leading-relaxed">
                        Great quality craftsmanship and thorough cleanup afterwards. The 3-tier package system made it very clear what was included. Will definitely hire again!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Sticky 3-Tier Fiverr Package Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 border border-[#e4e5e7] rounded-xl overflow-hidden shadow-fiverr bg-white">
              {/* 3 Package Tabs */}
              <div className="grid grid-cols-3 bg-[#fafafa] border-b border-[#e4e5e7] text-xs font-bold text-center">
                {['basic', 'standard', 'premium'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setActiveTab(tier)}
                    className={`py-3.5 capitalize transition-all border-b-2 ${
                      activeTab === tier
                        ? 'border-[#1dbf73] text-[#1dbf73] bg-white font-extrabold'
                        : 'border-transparent text-[#74767e] hover:text-[#222325]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* Package Body */}
              <div className="p-6 space-y-5">
                {/* Header: Name and Price */}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-base text-[#222325]">{currentPackage.name}</h3>
                  <span className="text-2xl font-extrabold text-[#222325]">
                    ৳{currentPackage.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#62646a] leading-relaxed min-h-[2.5rem]">
                  {currentPackage.description}
                </p>

                {/* Turnaround & Follow-up Details */}
                <div className="flex items-center gap-4 text-xs font-bold text-[#404145]">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineClock className="text-base text-[#74767e]" />
                    {currentPackage.turnaround}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineRefresh className="text-base text-[#74767e]" />
                    {currentPackage.revisions}
                  </span>
                </div>

                {/* Checklist of Features */}
                <ul className="space-y-2.5 text-xs text-[#404145] pt-2">
                  {currentPackage.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <HiCheck className="text-[#1dbf73] text-base shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Gig Extras Section inside order box */}
                <div className="pt-4 border-t border-[#efeff0]">
                  <p className="text-xs font-bold text-[#222325] mb-2.5">Optional Add-ons</p>
                  <div className="space-y-2">
                    {GIG_EXTRAS.map((extra) => (
                      <label
                        key={extra.id}
                        className="flex items-start gap-2.5 text-xs cursor-pointer select-none p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                          className="mt-0.5 rounded text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between font-semibold text-[#222325]">
                            <span>{extra.title}</span>
                            <span className="text-[#1dbf73]">+৳{extra.price}</span>
                          </div>
                          <p className="text-[11px] text-[#74767e] leading-snug">{extra.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Big Green Continue Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Continue (৳{totalPrice}) &rarr;
                </button>

                <p className="text-[11px] text-center text-[#74767e] font-medium">
                  Compare packages or contact seller for custom quotes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking / Fiverr Order Modal */}
      {showModal && (
        <BookingModal
          worker={profile}
          offer={{
            service_id: offers?.[0]?.service_id || { service_name: profile.service_type },
            hourly_rate: currentPackage.price,
            fixed_price: totalPrice,
          }}
          selectedPackage={{
            tier: activeTab,
            ...currentPackage,
          }}
          selectedExtras={selectedExtras}
          totalPrice={totalPrice}
          onClose={() => setShowModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
};

export default WorkerProfilePage;
