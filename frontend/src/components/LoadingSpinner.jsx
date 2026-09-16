import React from 'react';

const LoadingSpinner = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 border-4 border-ink/10 border-t-hazard rounded-full animate-spin" />
    <p className="text-sm text-ink/50 font-mono">{label}</p>
  </div>
);

export default LoadingSpinner;
