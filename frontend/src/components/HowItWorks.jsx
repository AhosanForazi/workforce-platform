import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { title: 'Register & Verify', text: 'Create an account with verified credentials and complete your profile setup.' },
  { title: 'Search & Discover', text: 'Browse available workers with location-based filters and category-specific search.' },
  { title: 'Review Profiles', text: 'Check ratings, real reviews, and transparent service rates before you commit.' },
  { title: 'Book the Job', text: 'Submit a request with your preferred date, time and job details.' },
  { title: 'Track the Work', text: 'Status updates from accepted to in-progress to completed, in real time.' },
  { title: 'Rate & Pay', text: 'Pay securely and leave a transparent review based on the actual service.' },
];

const HowItWorks = () => (
  <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
    <div className="mb-16">
      <span className="font-mono text-xs tracking-widest text-hazard">// USER JOURNEY</span>
      <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">From panic to fixed, in six steps.</h2>
    </div>

    <div className="relative">
      <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-ink/10" />
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="relative z-10 w-16 h-16 rounded-full bg-panel border-2 border-ink flex items-center justify-center font-display font-bold text-2xl mb-4 shadow-card">
              {i + 1}
            </div>
            <h3 className="font-display font-bold text-lg mb-1">{s.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
