import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiStar, HiShieldCheck, HiCheckCircle } from 'react-icons/hi';

const POPULAR_TAGS = [
  { label: 'Electrician', slug: 'Electrician' },
  { label: 'Emergency Plumbing', slug: 'Plumber' },
  { label: 'Interior Painting', slug: 'Painter' },
  { label: 'Furniture Assembly', slug: 'Carpenter' },
  { label: 'Deep Cleaning', slug: 'Cleaner' },
];

const Hero = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <section className="relative bg-[#003912] text-white overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003912] via-[#014417] to-[#0a2e16] opacity-95" />
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#1dbf73_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {/* Pro badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#1dbf73] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
              Trusted on-demand local workforce
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Find the right <span className="italic font-serif text-[#1dbf73]">freelance</span> service, right away
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-200/90 max-w-xl font-normal leading-relaxed">
              Book top-rated local electricians, plumbers, painters, carpenters, and cleaners with transparent 3-tier Gig packages and guaranteed satisfaction.
            </p>

            {/* Fiverr-style Main Hero Search Box */}
            <form onSubmit={handleSearch} className="mt-8 max-w-xl">
              <div className="flex items-stretch bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-transparent focus-within:border-[#1dbf73] transition-all">
                <div className="flex items-center pl-4 pr-2 text-gray-400">
                  <HiOutlineSearch className="text-2xl text-gray-500" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for any service (e.g. electrical wiring, pipe leak)..."
                  className="w-full py-4 px-2 text-sm sm:text-base text-[#222325] placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#1dbf73] hover:bg-[#19a463] text-white px-6 sm:px-8 font-bold text-sm sm:text-base flex items-center justify-center transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Tags */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300">
              <span className="font-semibold text-white/80">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/browse?service=${tag.slug}`}
                  className="px-3 py-1 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 text-gray-200 transition-all"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Hero Showcase Gig Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative mx-auto max-w-sm">
              {/* Floating Verified Trust Pill */}
              <div className="absolute -top-4 -left-4 z-20 bg-white rounded-lg px-3.5 py-2 shadow-xl border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#eefaf4] flex items-center justify-center text-[#1dbf73]">
                  <HiShieldCheck className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#222325]">100% Verified Pro</p>
                  <p className="text-[10px] text-gray-500">ID & Skill Certified</p>
                </div>
              </div>

              {/* Sample Gig Card floating */}
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-[#222325]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                    alt="Featured electrical service"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#003912]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                    TOP RATED GIG
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80"
                      alt="Karim Sheikh"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#222325]">Karim Sheikh</p>
                      <p className="text-[10px] text-gray-500 font-medium">Master Electrician · Level 2</p>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[#404145] line-clamp-2 leading-relaxed mb-3">
                    I will inspect, repair and install electrical wiring, switchboards and circuit fixtures
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1 font-bold text-[#222325]">
                      <HiStar className="text-[#ffb33e]" />
                      4.9 <span className="text-gray-400 font-normal">(84)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold mr-1">FROM</span>
                      <span className="text-sm font-extrabold text-[#1dbf73]">৳350</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Review Pill */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-white rounded-lg px-3.5 py-2 shadow-xl border border-gray-100 flex items-center gap-2">
                <HiCheckCircle className="text-[#1dbf73] text-lg" />
                <span className="text-xs font-semibold text-[#222325]">3 Orders Completed Today</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fiverr Trust Logos Bar */}
      <div className="border-t border-white/10 bg-black/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs font-semibold text-gray-300">
          <span className="text-white/60">Trusted by over 10,000+ homes & local businesses:</span>
          <div className="flex items-center gap-6 sm:gap-10 text-white/80 font-bold tracking-wider">
            <span>RESIDENTIAL</span>
            <span>COMMERCIAL</span>
            <span>HOUSING SOC.</span>
            <span>RENOVATORS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
