import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineShieldExclamation, HiOutlineUserGroup, HiOutlineClock } from 'react-icons/hi';

const problems = [
  {
    icon: HiOutlineSearch,
    title: 'Customer Challenge',
    text: 'Customers struggle finding reliable local workers for various services without verified information and standardized platform solutions.',
  },
  {
    icon: HiOutlineShieldExclamation,
    title: 'Trust & Verification Gap',
    text: 'Lack of verified credentials and trust creates uncertainty in hiring decisions, leading to inefficient processes and poor outcomes.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Worker Access Problem',
    text: 'Workers face challenges reaching potential customers, while information asymmetry between service providers and seekers persists widely.',
  },
  {
    icon: HiOutlineClock,
    title: 'Market Inefficiency',
    text: 'Time-consuming hiring processes lack standardization, creating friction and preventing efficient connections between supply and demand.',
  },
];

const ProblemSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
        <div>
          <span className="font-mono text-xs tracking-widest text-hazard">// THE PROBLEM WE SOLVE</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Hiring local help is broken.</h2>
        </div>
        <p className="max-w-sm text-ink/60 text-sm leading-relaxed">
          Four cracks in the local labor market — the same four things WorkForce was engineered to patch.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative bg-panel rounded-2xl p-6 shadow-card border border-ink/5 hover:-translate-y-1.5 hover:shadow-ticket transition-all duration-300"
          >
            <div className="absolute top-5 right-5 font-mono text-xs text-ink/20">0{i + 1}</div>
            <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center mb-5 group-hover:bg-hazard transition-colors">
              <p.icon className="text-2xl text-concrete group-hover:text-ink transition-colors" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">{p.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProblemSection;
