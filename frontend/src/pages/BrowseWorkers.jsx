import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineAdjustments,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiStar,
  HiOutlineX,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GigCard from '../components/GigCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEMO_WORKERS, GIG_CATEGORIES, getWorkerPackages } from '../utils/demoData';

const BrowseWorkers = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlService = searchParams.get('service') || 'All';
  const urlQ = searchParams.get('q') || '';

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(urlQ);
  const [trade, setTrade] = useState(urlService);
  const [proOnly, setProOnly] = useState(urlService === 'Pro');
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'rating' | 'price_low'
  const [isFallback, setIsFallback] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  // Sync with searchParams if URL changes
  useEffect(() => {
    const s = searchParams.get('service');
    const query = searchParams.get('q');
    if (s) {
      if (s === 'Pro') {
        setProOnly(true);
        setTrade('All');
      } else {
        setTrade(s);
        setProOnly(false);
      }
    }
    if (query !== null) {
      setQ(query || '');
    }
  }, [searchParams]);

  const fetchWorkers = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      const params = {};
      if (q) params.q = q;
      if (trade !== 'All') params.service = trade;

      const { data } = await api.get('/workers', { params });
      if (Array.isArray(data)) {
        setWorkers(data);
        setIsFallback(false);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (e) {
      console.warn('Live API request failed, using local demo workers:', e.message);
      setErrorNotice(
        e.isHtmlFallback
          ? 'Live database offline. Showing curated demo Gigs.'
          : e.message || 'Connecting to backend timed out. Showing curated demo Gigs.'
      );

      // Filter demo workers locally
      let filtered = [...DEMO_WORKERS];
      if (trade !== 'All') {
        filtered = filtered.filter(
          (w) => (w.service_type || '').toLowerCase() === trade.toLowerCase()
        );
      }
      if (q) {
        const ql = q.toLowerCase();
        filtered = filtered.filter(
          (w) =>
            (w.user_id?.name || '').toLowerCase().includes(ql) ||
            (w.service_type || '').toLowerCase().includes(ql) ||
            (w.bio || '').toLowerCase().includes(ql) ||
            (w.gigTitle || '').toLowerCase().includes(ql)
        );
      }
      setWorkers(filtered);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade, q]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (q.trim()) p.set('q', q.trim());
      else p.delete('q');
      return p;
    });
    fetchWorkers();
  };

  const handleTradeSelect = (selectedTrade) => {
    setTrade(selectedTrade);
    setProOnly(false);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (selectedTrade !== 'All') p.set('service', selectedTrade);
      else p.delete('service');
      return p;
    });
  };

  // Filter & sort in memory
  let displayWorkers = [...workers];

  // If logged-in user is a worker, ensure their card is displayed with their uploaded image
  if (user && user.role === 'worker') {
    const existingIndex = displayWorkers.findIndex(
      (w) =>
        w.user_id?._id === user.id ||
        w.user_id?._id === user._id ||
        w.user_id?.email === user.email ||
        w._id === user.id ||
        w._id === user._id
    );

    if (existingIndex >= 0) {
      const currentWorker = {
        ...displayWorkers[existingIndex],
        avatar: user.avatar || displayWorkers[existingIndex].avatar,
        profileImage: user.avatar || displayWorkers[existingIndex].profileImage,
        user_id: {
          ...displayWorkers[existingIndex].user_id,
          avatar: user.avatar || displayWorkers[existingIndex].user_id?.avatar,
        },
      };
      displayWorkers.splice(existingIndex, 1);
      displayWorkers.unshift(currentWorker);
    } else {
      const myTrade = user.service_type || 'Electrician';
      const myCard = {
        _id: user.id || user._id || 'my-worker-profile',
        service_type: myTrade,
        experience: '3-5 years',
        rating: 5.0,
        ratingCount: 1,
        bio: user.bio || `Certified ${myTrade} specialist ready to help with your project.`,
        isVerified: true,
        sellerLevel: 'Pro Verified',
        skills: [myTrade, 'Installation', 'Maintenance', 'Repairs'],
        completedJobs: 0,
        avatar: user.avatar,
        profileImage: user.avatar,
        gigTitle: `I will provide professional ${myTrade} services and reliable repairs`,
        user_id: {
          _id: user.id || user._id,
          name: user.name,
          email: user.email,
          location: user.location || 'Dhaka',
          avatar: user.avatar,
        },
      };

      const matchesTrade = trade === 'All' || myCard.service_type.toLowerCase() === trade.toLowerCase();
      const matchesQ = !q || myCard.user_id.name.toLowerCase().includes(q.toLowerCase()) || myCard.service_type.toLowerCase().includes(q.toLowerCase());

      if (matchesTrade && matchesQ) {
        displayWorkers.unshift(myCard);
      }
    }
  }

  if (proOnly) {
    displayWorkers = displayWorkers.filter((w) => w.isVerified);
  }
  if (sortBy === 'rating') {
    displayWorkers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'price_low') {
    displayWorkers.sort((a, b) => {
      const priceA = getWorkerPackages(a).basic?.price || 350;
      const priceB = getWorkerPackages(b).basic?.price || 350;
      return priceA - priceB;
    });
  }

  const categoryName = trade !== 'All' ? trade : q ? `"${q}"` : 'All Services';

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#74767e] mb-4">
          <Link to="/" className="hover:text-[#1dbf73]">Home</Link>
          <span>/</span>
          <span>Explore Gigs</span>
          <span>/</span>
          <span className="font-semibold text-[#222325]">{categoryName}</span>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">
              {trade !== 'All' ? `${trade} Services` : q ? `Results for "${q}"` : 'Explore All Services'}
            </h1>
            <p className="text-xs sm:text-sm text-[#74767e] mt-1">
              Find verified {trade !== 'All' ? trade.toLowerCase() : 'skilled'} professionals with transparent 3-tier Gig packages.
            </p>
          </div>
          <span className="text-xs text-[#74767e] font-semibold">
            {displayWorkers.length} services available
          </span>
        </div>

        {/* Fallback Notice */}
        {isFallback && errorNotice && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <HiOutlineExclamationCircle className="text-lg text-emerald-600 shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> {errorNotice}
              </span>
            </div>
            <button
              onClick={fetchWorkers}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
            >
              Retry Live
            </button>
          </div>
        )}

        {/* Fiverr-Style Filter Bar */}
        <div className="bg-white rounded-lg border border-[#e4e5e7] p-4 mb-8 shadow-sm space-y-4">
          {/* Top Row: Search input & Pro toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <form onSubmit={onSearchSubmit} className="flex-1 max-w-md relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gigs or skills..."
                className="w-full pl-3.5 pr-10 py-2 border border-gray-300 focus:border-[#1dbf73] rounded-md text-xs text-[#222325] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 bg-[#222325] text-white rounded-r-md flex items-center justify-center hover:bg-[#1dbf73] transition-colors"
              >
                <HiOutlineSearch className="text-base" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* Pro Verified Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={proOnly}
                  onChange={(e) => setProOnly(e.target.checked)}
                  className="rounded text-[#1dbf73] focus:ring-[#1dbf73]"
                />
                <span className="font-bold text-[#222325] flex items-center gap-1">
                  Workforce <span className="bg-[#1dbf73] text-white text-[9px] px-1 rounded">PRO</span>
                </span>
              </label>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-[#74767e] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs text-[#222325] focus:outline-none bg-white font-medium"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
            <button
              onClick={() => handleTradeSelect('All')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                trade === 'All'
                  ? 'bg-[#222325] text-white'
                  : 'bg-gray-100 text-[#62646a] hover:bg-gray-200'
              }`}
            >
              All Trades
            </button>
            {['Electrician', 'Plumber', 'Painter', 'Carpenter', 'Cleaner', 'Gardener'].map((t) => (
              <button
                key={t}
                onClick={() => handleTradeSelect(t)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  trade === t
                    ? 'bg-[#1dbf73] text-white shadow-sm'
                    : 'bg-gray-100 text-[#62646a] hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Gigs Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Searching available Gigs…" />
          </div>
        ) : displayWorkers.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e4e5e7] p-12 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl text-gray-400 mx-auto">
              <HiOutlineSearch />
            </div>
            <h3 className="text-lg font-bold text-[#222325]">No Gigs matched your criteria</h3>
            <p className="text-xs text-[#74767e] max-w-sm mx-auto">
              Try searching with different keywords or clearing your trade and filter options.
            </p>
            <button
              onClick={() => {
                setTrade('All');
                setQ('');
                setProOnly(false);
                setSearchParams({});
              }}
              className="px-5 py-2 rounded bg-[#1dbf73] text-white text-xs font-bold hover:bg-[#19a463] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayWorkers.map((worker, i) => (
              <GigCard key={worker._id} worker={worker} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseWorkers;
