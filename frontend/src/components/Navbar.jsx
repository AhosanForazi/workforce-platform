import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineShoppingBag,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineSwitchHorizontal,
  HiOutlineLogout,
  HiCheckCircle,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getInitials } from '../utils/imageUrl';
import { GIG_CATEGORIES } from '../utils/demoData';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Track scroll for sticky border shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e4e5e7] transition-all">
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Search Bar */}
          <div className="flex items-center gap-4 sm:gap-8 flex-1 max-w-3xl">
            {/* Fiverr-style Logo: workforce. with green dot */}
            <Link to="/" className="flex items-center select-none shrink-0 group">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#222325]">
                workforce<span className="text-[#1dbf73] font-black text-3xl sm:text-4xl leading-none">.</span>
              </span>
            </Link>

            {/* Global Search Bar (Fiverr Style) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center flex-1 max-w-xl relative"
            >
              <div className="flex items-center w-full border border-[#b5b6ba] focus-within:border-[#222325] rounded-md overflow-hidden bg-white shadow-sm transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for today?"
                  className="w-full py-2.5 px-3.5 text-sm text-[#222325] placeholder-[#74767e] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#222325] hover:bg-[#1dbf73] text-white px-4 py-2.5 flex items-center justify-center transition-colors shrink-0"
                  title="Search"
                >
                  <HiOutlineSearch className="text-lg" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/browse?service=Pro"
              className="text-sm font-semibold text-[#62646a] hover:text-[#1dbf73] transition-colors flex items-center gap-1.5"
            >
              <span className="font-bold text-[#222325]">Workforce</span>
              <span className="bg-[#1dbf73] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                PRO
              </span>
            </Link>

            <Link
              to="/browse"
              className="text-sm font-semibold text-[#62646a] hover:text-[#1dbf73] transition-colors"
            >
              Explore Gigs
            </Link>

            {/* Seller / Worker switch */}
            {user?.role === 'worker' ? (
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-[#1dbf73] hover:text-[#19a463] flex items-center gap-1 transition-colors"
              >
                <HiOutlineSwitchHorizontal className="text-base" />
                Seller Dashboard
              </Link>
            ) : (
              <Link
                to={user ? "/profile" : "/register"}
                className="text-sm font-semibold text-[#62646a] hover:text-[#1dbf73] transition-colors"
              >
                Become a Seller
              </Link>
            )}

            {/* Auth State */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Orders / Bookings Icon */}
                <NavLink
                  to="/bookings"
                  className={({ isActive }) =>
                    `p-2 rounded-full hover:bg-gray-100 relative text-xl transition-colors ${
                      isActive ? 'text-[#1dbf73]' : 'text-[#62646a]'
                    }`
                  }
                  title="Orders & Bookings"
                >
                  <HiOutlineShoppingBag />
                </NavLink>

                {/* Notifications Bell */}
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `p-2 rounded-full hover:bg-gray-100 relative text-xl transition-colors ${
                      isActive ? 'text-[#1dbf73]' : 'text-[#62646a]'
                    }`
                  }
                  title="Notifications"
                >
                  <HiOutlineBell />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1dbf73] rounded-full" />
                </NavLink>

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#1dbf73]/30 transition-all"
                  >
                    {user.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#222325] text-white flex items-center justify-center font-bold text-xs">
                        {getInitials(user.name, 1)}
                      </span>
                    )}
                    <HiOutlineChevronDown className="text-xs text-[#74767e]" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#e4e5e7] py-2 z-50 text-sm"
                      >
                        <div className="px-4 py-3 border-b border-[#efeff0]">
                          <p className="font-bold text-[#222325] truncate">{user.name}</p>
                          <p className="text-xs text-[#74767e] truncate">{user.email}</p>
                          <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#eefaf4] text-[#1dbf73] rounded">
                            {user.role} mode
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-[#404145] hover:bg-gray-50 hover:text-[#1dbf73]"
                          >
                            <HiOutlineUser className="text-base" /> Profile & Settings
                          </Link>
                          <Link
                            to="/bookings"
                            className="flex items-center gap-2.5 px-4 py-2 text-[#404145] hover:bg-gray-50 hover:text-[#1dbf73]"
                          >
                            <HiOutlineShoppingBag className="text-base" /> Manage Orders
                          </Link>
                          {user.role === 'worker' && (
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2.5 px-4 py-2 text-[#404145] hover:bg-gray-50 hover:text-[#1dbf73]"
                            >
                              <HiOutlineSwitchHorizontal className="text-base" /> Seller Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-[#efeff0] pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            <HiOutlineLogout className="text-base" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#62646a] hover:text-[#1dbf73] px-3 py-2 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-[#1dbf73] border border-[#1dbf73] hover:bg-[#1dbf73] hover:text-white px-4 py-1.5 rounded transition-all duration-200"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <NavLink to="/bookings" className="p-2 text-xl text-[#62646a]">
                <HiOutlineShoppingBag />
              </NavLink>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#222325] hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
          <div className="flex items-center border border-[#dadbdd] rounded-md overflow-hidden bg-white shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Electrician, Plumber)..."
              className="w-full py-2 px-3 text-sm text-[#222325] placeholder-[#74767e] focus:outline-none"
            />
            <button type="submit" className="bg-[#222325] text-white p-2.5">
              <HiOutlineSearch className="text-base" />
            </button>
          </div>
        </form>
      </div>

      {/* Fiverr Secondary Category Navigation Bar */}
      <div className="border-t border-[#efeff0] bg-white overflow-x-auto scrollbar-none hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 py-2.5 text-sm font-medium text-[#62646a] whitespace-nowrap">
            {GIG_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={cat.slug ? `/browse?service=${cat.slug}` : '/browse'}
                  className="hover:text-[#1dbf73] hover:border-b-2 hover:border-[#1dbf73] pb-1 transition-all inline-block"
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-[#e4e5e7] px-4 py-4 space-y-3 overflow-hidden shadow-lg"
          >
            {user ? (
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#222325] text-white flex items-center justify-center font-bold">
                    {getInitials(user.name, 1)}
                  </div>
                  <div>
                    <p className="font-bold text-[#222325]">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                <Link
                  to="/login"
                  className="text-center py-2 text-sm font-bold text-[#222325] border border-gray-300 rounded"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2 text-sm font-bold text-white bg-[#1dbf73] rounded"
                >
                  Join
                </Link>
              </div>
            )}

            <div className="space-y-2 text-sm font-semibold text-[#404145]">
              <Link to="/browse" className="block py-2 hover:text-[#1dbf73]">
                Explore All Gigs
              </Link>
              <Link to="/bookings" className="block py-2 hover:text-[#1dbf73]">
                My Orders & Bookings
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="block py-2 hover:text-[#1dbf73]">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block py-2 hover:text-[#1dbf73]">
                    Profile & Settings
                  </Link>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold uppercase text-gray-400 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#62646a]">
                {GIG_CATEGORIES.slice(1).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/browse?service=${cat.slug}`}
                    className="p-1.5 rounded hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
