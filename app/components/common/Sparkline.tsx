'use client';

import { motion } from 'framer-motion';

export const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end h-full gap-px">
      {data.map((value, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ duration: 1, delay: i * 0.05 }}
          className="flex-1 bg-gradient-to-t from-black/0 to-current"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};