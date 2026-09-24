import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineDocumentText, HiOutlineBriefcase, HiOutlineCheckCircle } from 'react-icons/hi';

const steps = [
  {
    icon: HiOutlineSearch,
    title: '1. Browse or Search Gigs',
    text: 'Explore verified worker listings with transparent customer reviews, portfolios, and badges.',
  },
  {
    icon: HiOutlineDocumentText,
    title: '2. Select Your Package',
    text: 'Choose between Basic, Standard, or Premium packages with clear scope and delivery time.',
  },
  {
    icon: HiOutlineBriefcase,
    title: '3. Professional Execution',
    text: 'Your verified worker arrives on schedule with required tools and materials to get the job done.',
  },
  {
    icon: HiOutlineCheckCircle,
    title: '4. Inspect & Approve',
    text: 'Review the completed work, release payment securely, and rate your worker to help the community.',
  },
];

const HowItWorks = () => (
  <section className="py-20 bg-white border-b border-[#efeff0]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          Simple & Transparent
        </span>
        <h2 className="text-3xl font-extrabold text-[#222325] mt-1">
          How hiring on Workforce works
        </h2>
        <p className="text-sm text-[#62646a] mt-2">
          From finding the right craftsman to job completion in 4 easy steps.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-xl border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-[#eefaf4] text-[#1dbf73] flex items-center justify-center text-2xl mb-4 font-bold">
              <s.icon />
            </div>
            <h3 className="text-base font-bold text-[#222325] mb-2">{s.title}</h3>
            <p className="text-xs text-[#62646a] leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
