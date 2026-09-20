import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ label = 'Loading…', hint }) => {
  const [takingLong, setTakingLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTakingLong(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
      <div className="w-10 h-10 border-4 border-ink/10 border-t-hazard rounded-full animate-spin" />
      <p className="text-sm text-ink/70 font-mono font-medium">{label}</p>
      {takingLong && (
        <p className="text-xs text-ink/50 max-w-sm mt-1 animate-pulse">
          {hint || 'Connecting to server… If this is your first visit in a while, free hosting (e.g. Render) may take ~30s to wake up.'}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
