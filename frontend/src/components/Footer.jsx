import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => (
  <footer className="bg-ink text-concrete/80 mt-24">
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-md bg-hazard flex items-center justify-center font-display font-bold text-ink">W</span>
          <span className="font-display font-bold text-xl text-concrete">WORK<span className="text-hazard">FORCE</span></span>
        </div>
        <p className="text-sm leading-relaxed text-concrete/60 max-w-xs">
          The on-demand dispatch board connecting verified local workers with the people who need them — now.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-wide text-concrete mb-4">Platform</h4>
        <ul className="space-y-2 text-sm text-concrete/60">
          <li><Link to="/browse" className="hover:text-hazard transition-colors">Find a worker</Link></li>
          <li><Link to="/register" className="hover:text-hazard transition-colors">Join as a worker</Link></li>
          <li><Link to="/dashboard" className="hover:text-hazard transition-colors">Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-wide text-concrete mb-4">Trades</h4>
        <ul className="space-y-2 text-sm text-concrete/60">
          <li>Electrician</li>
          <li>Plumber</li>
          <li>Painter</li>
          <li>Carpenter &amp; more</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-wide text-concrete mb-4">Contact</h4>
        <ul className="space-y-3 text-sm text-concrete/60">
          <li className="flex items-center gap-2"><HiOutlineMail /> dispatch@workforce.app</li>
          <li className="flex items-center gap-2"><HiOutlinePhone /> +880 1XXX-XXXXXX</li>
          <li className="flex items-center gap-2"><HiOutlineLocationMarker /> Faridpur, Dhaka Division</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-concrete/10 py-5 text-center text-xs text-concrete/40 font-mono">
      © {new Date().getFullYear()} WORKFORCE — On-Demand Workforce Management System · Built for the Local Worker Hiring Platform project
    </div>
  </footer>
);

export default Footer;
