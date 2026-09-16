import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi';

const tickets = [
  { code: 'JOB-0417', trade: 'Electrician', status: 'AVAILABLE NOW', eta: '18 min', rotate: -6, top: '6%', left: '2%', color: 'signal' },
  { code: 'JOB-0418', trade: 'Painter', status: 'VERIFIED', eta: '2 hr slot', rotate: 4, top: '46%', left: '0%', color: 'dispatch' },
  { code: 'JOB-0419', trade: 'Plumber', status: 'AVAILABLE NOW', eta: '25 min', rotate: -3, top: '68%', left: '10%', color: 'signal' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden blueprint-bg border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-concrete text-xs font-mono tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-hazard animate-pulseDot" />
            DISPATCH BOARD · LIVE
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-ink">
            IT HAPPENS
            <br />
            WHEN YOU
            <br />
            <span className="text-hazard">LEAST EXPECT IT.</span>
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-md leading-relaxed">
            The fan dies at midnight. The pipe bursts on a Sunday. WorkForce puts a
            verified electrician, plumber, painter or carpenter on your street on standby —
            searchable, ratable, bookable in minutes.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/browse"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-hazard text-ink font-bold shadow-ticket hover:bg-ink hover:text-hazard transition-colors"
            >
              Find a worker now
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-ink font-bold hover:bg-ink hover:text-concrete transition-colors"
            >
              Register as a worker
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-8 text-sm text-ink/60">
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="text-signal text-xl" />
              Verified credentials
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineLightningBolt className="text-hazard text-xl" />
              ~2 hr avg. response
            </div>
          </div>
        </motion.div>

        <div className="relative h-[420px] hidden md:block">
          {tickets.map((t, i) => (
            <motion.div
              key={t.code}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: t.rotate }}
              transition={{ delay: 0.3 + i * 0.18, duration: 0.6, ease: 'easeOut' }}
              style={{ top: t.top, left: t.left, ['--r']: `${t.rotate}deg` }}
              className="ticket ticket-hero absolute w-72 shadow-ticket animate-float"
            >
              <div className="p-4">
                <div className="flex items-center justify-between font-mono text-xs text-ink/40">
                  <span>#{t.code}</span>
                  <span className={`flex items-center gap-1 font-bold ${t.color === 'signal' ? 'text-signal' : 'text-dispatch'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${t.color === 'signal' ? 'bg-signal animate-pulseDot' : 'bg-dispatch'}`} />
                    {t.status}
                  </span>
                </div>
                <div className="mt-2 font-display font-bold text-2xl">{t.trade}</div>
                <div className="ticket-perf mt-3 pt-3 flex items-center justify-between text-xs text-ink/50">
                  <span>Response: {t.eta}</span>
                  <span className="stamp px-2 py-0.5 text-[10px] font-bold text-hazard">DISPATCHED</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full h-3 bg-hazard-stripe opacity-90" />
    </section>
  );
};

export default Hero;
