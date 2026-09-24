import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa';
import { GIG_CATEGORIES } from '../utils/demoData';

const Footer = () => (
  <footer className="bg-white border-t border-[#e4e5e7] text-[#74767e] text-sm mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* 5 Columns of Footer Links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Col 1: Categories */}
        <div>
          <h4 className="font-bold text-[#404145] text-sm mb-4">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            {GIG_CATEGORIES.slice(1).map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/browse?service=${cat.slug}`}
                  className="hover:text-[#1dbf73] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2: About */}
        <div>
          <h4 className="font-bold text-[#404145] text-sm mb-4">About</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-[#1dbf73]">Careers</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Press & News</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Partnerships</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Terms of Service</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Intellectual Property</Link></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="font-bold text-[#404145] text-sm mb-4">Support & Education</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-[#1dbf73]">Help & Support</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Trust & Safety</Link></li>
            <li><Link to="/browse" className="hover:text-[#1dbf73]">Selling on Workforce</Link></li>
            <li><Link to="/browse" className="hover:text-[#1dbf73]">Buying on Workforce</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Workforce Guides</Link></li>
          </ul>
        </div>

        {/* Col 4: Community */}
        <div>
          <h4 className="font-bold text-[#404145] text-sm mb-4">Community</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-[#1dbf73]">Customer Stories</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Community Hub</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Forum & Help</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Events & Meetups</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Creator Program</Link></li>
          </ul>
        </div>

        {/* Col 5: Business */}
        <div>
          <h4 className="font-bold text-[#404145] text-sm mb-4">Business Solutions</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/browse" className="font-semibold text-[#222325] hover:text-[#1dbf73] flex items-center gap-1">
                Workforce Pro <span className="bg-[#1dbf73] text-white text-[9px] px-1 py-0.2 rounded">PRO</span>
              </Link>
            </li>
            <li><Link to="/register" className="hover:text-[#1dbf73]">Become a Worker</Link></li>
            <li><Link to="/browse" className="hover:text-[#1dbf73]">Enterprise Hiring</Link></li>
            <li><Link to="/" className="hover:text-[#1dbf73]">Contact Sales</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="pt-8 border-t border-[#efeff0] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-black text-2xl text-[#222325] tracking-tight">
            workforce<span className="text-[#1dbf73]">.</span>
          </Link>
          <span className="text-xs text-[#74767e]">
            © {new Date().getFullYear()} Workforce International Ltd. All rights reserved.
          </span>
        </div>

        {/* Social Icons & Currency */}
        <div className="flex items-center gap-5 text-gray-500">
          <div className="flex items-center gap-4 text-base">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#1dbf73]"><FaTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#1dbf73]"><FaFacebookF /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#1dbf73]"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#1dbf73]"><FaInstagram /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#1dbf73]"><FaPinterestP /></a>
          </div>

          <div className="h-4 w-px bg-gray-300 hidden sm:block" />

          <div className="text-xs font-semibold text-[#404145] hidden sm:flex items-center gap-2">
            <span>🌐 English</span>
            <span>৳ BDT</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
