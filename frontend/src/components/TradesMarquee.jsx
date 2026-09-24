import React from 'react';
import { Link } from 'react-router-dom';
import { GIG_CATEGORIES } from '../utils/demoData';

const TradesMarquee = () => {
  const categories = GIG_CATEGORIES.filter((c) => c.slug);

  return (
    <section className="py-12 bg-white border-b border-[#efeff0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">
            Popular services
          </h2>
          <Link
            to="/browse"
            className="text-sm font-semibold text-[#1dbf73] hover:underline"
          >
            See all categories &rarr;
          </Link>
        </div>

        {/* Categories Grid (Fiverr Style Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/browse?service=${cat.slug}`}
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-[#e4e5e7] hover:border-[#1dbf73] bg-white flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xl">{cat.icon}</span>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors line-clamp-1">
                  {cat.name}
                </p>
                <p className="text-[10px] text-[#74767e] mt-0.5 font-medium">Explore Gigs &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradesMarquee;
