import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
  HiOutlineLockClosed,
} from 'react-icons/hi';

const features = [
  { icon: HiOutlineLocationMarker, title: 'Location Intelligence', text: 'GPS-powered discovery finds nearby workers within a customizable radius, streamlining your search.' },
  { icon: HiOutlineSparkles, title: 'Smart Matching', text: 'An algorithm weighs skill match, availability and preferences to surface the right worker fast.' },
  { icon: HiOutlineBadgeCheck, title: 'Worker Verification', text: 'Multi-step credential validation and background checks keep the marketplace trustworthy.' },
  { icon: HiOutlineCurrencyDollar, title: 'Transparent Pricing', text: 'A clear cost breakdown shows before you confirm — no surprise call-out fees, ever.' },
  { icon: HiOutlineStar, title: 'Quality Assurance', text: 'A real review system and a fast dispute process protect both sides of every job.' },
  { icon: HiOutlineLockClosed, title: 'Security Features', text: 'Encrypted data and secure transactions protect your privacy from booking to payment.' },
];

const FeaturesSection = () => (
  <section className="bg-ink text-concrete py-24">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <div className="mb-14">
        <span className="font-mono text-xs tracking-widest text-hazard">// FEATURE DEEP DIVE</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Built like a dispatch system.</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-concrete/10 rounded-2xl overflow-hidden">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-ink p-8 hover:bg-[#221f18] transition-colors relative"
          >
            <span className="font-mono text-hazard text-sm">{String(i + 1).padStart(2, '0')}</span>
            <f.icon className="text-3xl my-4 text-hazard" />
            <h3 className="font-display font-bold text-2xl mb-2">{f.title}</h3>
            <p className="text-sm text-concrete/60 leading-relaxed">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
