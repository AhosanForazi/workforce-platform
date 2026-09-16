import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineCash, HiOutlineTrendingUp, HiOutlineGlobeAlt } from 'react-icons/hi';

const benefits = [
  { icon: HiOutlineClock, title: 'Time Savings', text: 'Instant discovery and a streamlined booking flow cut hiring time for busy customers and workers alike.' },
  { icon: HiOutlineCash, title: 'Cost Efficiency', text: 'No inflated call-out premiums — transparent rates mean better value on every job.' },
  { icon: HiOutlineTrendingUp, title: 'Worker Empowerment', text: 'Direct access to a digital marketplace expands income opportunities for local tradespeople.' },
  { icon: HiOutlineGlobeAlt, title: '24/7 Convenience', text: 'A mobile-first, always-on platform means booking anytime, anywhere — even at midnight.' },
];

const BenefitsSection = () => (
  <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
    <div className="grid md:grid-cols-2 gap-14 items-center">
      <div>
        <span className="font-mono text-xs tracking-widest text-hazard">// WHY WORKFORCE</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 mb-6">
          Built to pay off for both sides of the job.
        </h2>
        <p className="text-ink/60 leading-relaxed max-w-md">
          Every feature on this platform earns its place by solving a real friction point —
          for the customer waiting on a fix, and for the worker waiting on the next job.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-panel border border-ink/5 shadow-card"
          >
            <b.icon className="text-3xl text-dispatch mb-3" />
            <h4 className="font-display font-bold text-lg mb-1">{b.title}</h4>
            <p className="text-sm text-ink/60 leading-relaxed">{b.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
