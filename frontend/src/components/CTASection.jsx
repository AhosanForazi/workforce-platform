import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => (
  <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-hazard px-8 py-16 md:px-16 md:py-20 text-center"
    >
      <div className="absolute inset-0 blueprint-bg opacity-20" />
      <div className="relative">
        <h2 className="font-display font-bold text-4xl md:text-6xl text-ink leading-tight">
          Next emergency, already dispatched.
        </h2>
        <p className="mt-4 text-ink/80 max-w-xl mx-auto">
          Join the platform that puts a verified local worker one search away —
          whether you're hiring or you're the one showing up with the toolbox.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-ink text-concrete font-bold hover:bg-white hover:text-ink transition-colors"
          >
            Create your account
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-ink font-bold hover:bg-ink hover:text-concrete transition-colors"
          >
            Browse workers
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
