import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 10000, suffix: '+', label: 'Completed local orders' },
  { value: 98, suffix: '%', label: '5-star positive satisfaction' },
  { value: 2, suffix: 'h', label: 'Average response dispatch' },
  { value: 100, suffix: '%', label: 'Payment buyer protection' },
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
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
    <span ref={ref} className="font-extrabold text-4xl sm:text-5xl text-[#1dbf73]">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => (
  <section className="bg-white border-b border-[#efeff0] py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="p-4"
        >
          <Counter value={s.value} suffix={s.suffix} />
          <p className="mt-2 text-sm text-[#62646a] font-medium">{s.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
