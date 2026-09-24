import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineSupport,
} from 'react-icons/hi';

const valueProps = [
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Upfront, transparent pricing',
    text: 'No unexpected hourly charges or bargaining. Clear 3-tier Gig packages (Basic, Standard, Premium) with explicit scope and deliverables.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Quality work done quickly',
    text: 'Filter by turnaround time, customer reviews, or express emergency dispatch to have a vetted technician arrive at your doorstep in hours.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Protected payments, every time',
    text: 'Your funds remain securely held in escrow until the job is inspected and you approve the delivery with 100% satisfaction.',
  },
  {
    icon: HiOutlineSupport,
    title: '24/7 dedicated support',
    text: 'Round-the-clock dispute resolution, customer assistance, and warranty coverage so you never have to worry about unfinished work.',
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 bg-[#f7f7f7] border-b border-[#efeff0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Features */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222325] leading-tight">
              A whole world of skilled talent at your fingertips
            </h2>
            <p className="mt-4 text-base text-[#62646a] max-w-xl">
              From quick socket fixes to full home renovation and deep sanitation, Workforce connects you with verified tradespeople ready to work.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-8">
              {valueProps.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-full bg-[#eefaf4] text-[#1dbf73] flex items-center justify-center shrink-0 text-xl font-bold">
                    <item.icon />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#222325] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#62646a] mt-1.5 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Video / Visual Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                alt="Workforce pro in action"
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
                  <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                    Workforce Standard
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#222325]">
                  Over 98% of orders completed on schedule
                </h4>
                <p className="text-xs text-[#62646a] mt-1 leading-relaxed">
                  Real customers rate our workers after every job. No fake reviews, no unverified accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
