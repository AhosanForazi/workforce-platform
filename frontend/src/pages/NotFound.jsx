import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
    <span className="font-mono text-hazard text-sm tracking-widest">// 404</span>
    <h1 className="font-display font-bold text-6xl mt-2 mb-4">Job ticket not found.</h1>
    <p className="text-ink/60 mb-8 max-w-sm">This page must have been dispatched somewhere else. Let's get you back on the board.</p>
    <Link to="/" className="px-6 py-3 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors">
      Back to home
    </Link>
  </div>
);

export default NotFound;
