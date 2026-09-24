import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-[#003912] px-8 py-16 sm:px-16 text-center text-white"
    >
      <div className="relative max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Find the skilled service needed to get your home running.
        </h2>
        <p className="mt-4 text-gray-200 text-sm sm:text-base leading-relaxed">
          Join thousands of homeowners and local businesses using Workforce to hire verified electricians, plumbers, carpenters, and painters on demand.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm transition-colors shadow-lg"
          >
            Get Started Free
          </Link>
          <Link
            to="/browse"
            className="px-8 py-3.5 rounded bg-transparent border border-white hover:bg-white hover:text-[#003912] text-white font-bold text-sm transition-all"
          >
            Explore All Gigs
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
