import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 99.5, suffix: '%', label: 'System uptime target' },
  { value: 2, suffix: ' hr', label: 'Avg. worker response time' },
  { value: 10000, suffix: '+', label: 'Concurrent users supported' },
  { value: 75, suffix: '%', label: 'Monthly active-user retention' },
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display font-bold text-5xl md:text-6xl text-hazard">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => (
  <section className="blueprint-bg border-y border-ink/10 py-20">
    <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <Counter value={s.value} suffix={s.suffix} />
          <p className="mt-2 text-sm text-ink/60 font-medium">{s.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
