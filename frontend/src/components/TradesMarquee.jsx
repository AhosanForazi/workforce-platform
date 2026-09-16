import React from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { GiHammerNails, GiWaterDrop, GiPaintRoller, GiPlantWatering, GiBroom } from 'react-icons/gi';

const trades = [
  { name: 'Electrician', icon: HiOutlineLightningBolt },
  { name: 'Plumber', icon: GiWaterDrop },
  { name: 'Painter', icon: GiPaintRoller },
  { name: 'Carpenter', icon: GiHammerNails },
  { name: 'Gardener', icon: GiPlantWatering },
  { name: 'Cleaner', icon: GiBroom },
];

const Row = () => (
  <>
    {trades.map((t) => (
      <div key={t.name} className="flex items-center gap-3 px-8 shrink-0">
        <t.icon className="text-2xl text-hazard" />
        <span className="font-display font-semibold text-2xl tracking-wide text-ink/70">{t.name}</span>
        <span className="text-ink/20 text-xl">/</span>
      </div>
    ))}
  </>
);

const TradesMarquee = () => (
  <div className="bg-panel border-y border-ink/10 py-6 overflow-hidden">
    <div className="flex w-max animate-marquee">
      <Row />
      <Row />
    </div>
  </div>
);

export default TradesMarquee;
