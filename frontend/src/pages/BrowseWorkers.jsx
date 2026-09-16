import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const trades = ['All', 'Electrician', 'Plumber', 'Painter', 'Carpenter', 'Gardener', 'Cleaner'];

const BrowseWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [trade, setTrade] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (trade !== 'All') params.service = trade;
      if (minRating) params.minRating = minRating;
      const { data } = await api.get('/workers', { params });
      setWorkers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    fetchWorkers();
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <div className="mb-10">
        <span className="font-mono text-xs tracking-widest text-hazard">// DISPATCH BOARD</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl mt-2">Find your worker.</h1>
        <p className="text-ink/60 mt-2 max-w-lg">Filter by trade, rating and search to find the right person for the job — verified, rated, ready.</p>
      </div>

      <form onSubmit={onSearchSubmit} className="ticket p-5 shadow-card flex flex-wrap gap-4 items-center mb-10">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] border border-ink/15 rounded-lg px-3 py-2.5">
          <HiOutlineSearch className="text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, trade, keyword…"
            className="w-full outline-none bg-transparent"
          />
        </div>
        <select value={trade} onChange={(e) => setTrade(e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent">
          {trades.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent">
          <option value={0}>Any rating</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors">
          <HiOutlineAdjustments /> Apply
        </button>
      </form>

      {loading ? (
        <LoadingSpinner label="Scanning the dispatch board…" />
      ) : workers.length === 0 ? (
        <div className="text-center py-20 text-ink/50">
          No workers match those filters yet. Try widening your search.
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((w, i) => (
            <WorkerCard key={w._id} worker={w} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BrowseWorkers;
