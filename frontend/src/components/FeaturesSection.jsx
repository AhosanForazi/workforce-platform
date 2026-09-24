import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GigCard from './GigCard';
import { DEMO_WORKERS } from '../utils/demoData';

const TABS = [
  { id: 'all', label: 'All Gigs' },
  { id: 'Electrician', label: '⚡ Electrical' },
  { id: 'Plumber', label: '🔧 Plumbing' },
  { id: 'Painter', label: '🎨 Painting' },
  { id: 'Carpenter', label: '🔨 Carpentry' },
  { id: 'Cleaner', label: '🧹 Cleaning' },
];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredWorkers =
    activeTab === 'all'
      ? DEMO_WORKERS
      : DEMO_WORKERS.filter((w) => w.service_type === activeTab);

  return (
    <section className="py-16 bg-white border-b border-[#efeff0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
              Hand-picked for you
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-1">
              Popular Gigs in your area
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#222325] text-white shadow-sm'
                    : 'bg-[#f7f7f7] text-[#62646a] hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredWorkers.slice(0, 8).map((worker, i) => (
            <GigCard key={worker._id} worker={worker} index={i} />
          ))}
        </div>

        {/* Explore more button */}
        <div className="mt-12 text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-8 py-3 rounded border border-[#222325] hover:bg-[#222325] hover:text-white text-sm font-bold text-[#222325] transition-all duration-200"
          >
            Explore More Gigs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
