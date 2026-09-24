import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi';

const BenefitsSection = () => (
  <section className="py-20 bg-[#0d084d] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Text */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#5840bb] text-white text-xs font-bold tracking-wider mb-6">
            <HiOutlineSparkles /> WORKFORCE PRO
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Vetted talent for your home & business
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl">
            Access an exclusive tier of master tradespeople and technicians with verified background checks, highest ratings, and guaranteed workmanship.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] flex items-center justify-center text-white shrink-0 mt-0.5">
                <HiOutlineCheck className="text-base font-bold" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Top 1% vetted professionals</p>
                <p className="text-sm text-gray-300">Each Pro worker passes a comprehensive background check and technical skill assessment.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] flex items-center justify-center text-white shrink-0 mt-0.5">
                <HiOutlineCheck className="text-base font-bold" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Dedicated priority dispatch</p>
                <p className="text-sm text-gray-300">Fast-track booking with guaranteed arrival time windows and 24/7 VIP hotline.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] flex items-center justify-center text-white shrink-0 mt-0.5">
                <HiOutlineCheck className="text-base font-bold" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Extended 30-day warranty coverage</p>
                <p className="text-sm text-gray-300">Complete peace of mind with our extended workmanship guarantee and free follow-up inspection.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/browse?service=Electrician"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm transition-colors"
            >
              Explore Pro Services
            </Link>
          </div>
        </div>

        {/* Right Photo Frame */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
              alt="Workforce Pro Specialist"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                Elite Technician
              </span>
              <p className="text-lg font-bold text-white mt-1">
                "Workforce Pro connects me with clients who value quality craftsmanship and safety standards."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BenefitsSection;
