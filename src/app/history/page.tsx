'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReadings, deleteReading } from '@/lib/storage';
import { ReadingRecord } from '@/lib/types';
import ResultCard from '@/components/ResultCard';

export default function HistoryPage() {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);

  useEffect(() => {
    setReadings(getReadings());
  }, []);

  const handleDelete = (id: string) => {
    deleteReading(id);
    setReadings(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-3xl font-bold text-[#4a3020] mb-2">八字记录</h1>
        <p className="text-stone-400">所有命理分析记录均保存在本地浏览器中</p>
      </motion.div>

      {readings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="text-4xl mb-4">📭</div>
          <p className="text-stone-400">暂无八字记录</p>
          <p className="text-stone-300 text-sm mt-1">去八字排盘页面开始你的第一次分析吧</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {readings.map(record => (
              <ResultCard key={record.id} record={record} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
