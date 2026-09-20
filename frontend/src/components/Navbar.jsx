import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getInitials } from '../utils/imageUrl';

const navLinkClass = ({ isActive }) =>
  `relative px-1 py-2 font-medium text-sm tracking-wide transition-colors ${
    isActive ? 'text-hazard' : 'text-ink/70 hover:text-ink'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-concrete/90 backdrop-blur-md shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-md bg-ink flex items-center justify-center relative overflow-hidden">
            <span className="absolute inset-0 bg-hazard translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative text-concrete font-display font-bold text-lg group-hover:text-ink transition-colors">W</span>
          </span>
          <span className="font-display font-bold text-xl tracking-tight">
            WORK<span className="text-hazard">FORCE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/browse" className={navLinkClass}>Find Workers</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          {user && <NavLink to="/bookings" className={navLinkClass}>Bookings</NavLink>}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NavLink to="/notifications" className="p-2 rounded-full hover:bg-ink/5 relative" title="Notifications">
                <HiOutlineBell className="text-xl" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hazard rounded-full animate-pulseDot" />
              </NavLink>
              <Link
                to="/profile"
                className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-ink/5 transition-colors group"
                title="Account profile"
              >
                {user.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-ink/15 group-hover:border-hazard transition-colors"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-dispatch text-concrete flex items-center justify-center font-bold text-xs">
                    {getInitials(user.name, 1)}
                  </span>
                )}
                <span className="text-sm text-ink/80 font-mono group-hover:text-hazard transition-colors">
                  Hi, {user.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-ink text-concrete text-sm font-semibold hover:bg-hazard hover:text-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-ink/80 hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-hazard text-ink text-sm font-bold shadow-card hover:bg-hazardDark hover:text-concrete transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-concrete border-t border-ink/10"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {user && (
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/profile"
                  className="py-2.5 flex items-center gap-3 border-b border-ink/10 mb-1"
                >
                  {user.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-ink/15"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-dispatch text-concrete flex items-center justify-center font-bold text-xs">
                      {getInitials(user.name, 1)}
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-sm leading-tight text-ink">{user.name}</p>
                    <p className="text-[11px] text-hazard font-mono uppercase">
                      {user.role === 'worker' ? 'Worker Profile' : 'Customer Account'}
                    </p>
                  </div>
                </NavLink>
              )}
              <NavLink onClick={() => setOpen(false)} to="/" end className="py-2 font-medium">Home</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/browse" className="py-2 font-medium">Find Workers</NavLink>
              {user && <NavLink onClick={() => setOpen(false)} to="/dashboard" className="py-2 font-medium">Dashboard</NavLink>}
              {user && <NavLink onClick={() => setOpen(false)} to="/bookings" className="py-2 font-medium">Bookings</NavLink>}
              {user && <NavLink onClick={() => setOpen(false)} to="/notifications" className="py-2 font-medium">Notifications</NavLink>}
              {user && <NavLink onClick={() => setOpen(false)} to="/profile" className="py-2 font-medium">Settings & Photo</NavLink>}
              {user ? (
                <button onClick={() => { setOpen(false); handleLogout(); }} className="mt-2 py-2 rounded-lg bg-ink text-concrete font-semibold">
                  Log out
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link onClick={() => setOpen(false)} to="/login" className="flex-1 text-center py-2 rounded-lg border border-ink/20 font-semibold">Log in</Link>
                  <Link onClick={() => setOpen(false)} to="/register" className="flex-1 text-center py-2 rounded-lg bg-hazard font-bold">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
