'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ReadingRecord } from '@/lib/types';

interface Props {
  record: ReadingRecord;
  onDelete?: (id: string) => void;
}

export default function ResultCard({ record, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const b = record.baziInput;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      {/* Header - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between border-b border-amber-100/30 hover:bg-amber-50/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-700">
            ☯ 八字
          </span>
          {b && (
            <span className="text-xs text-stone-500">
              {b.name || '匿名'} · {b.gender === 'male' ? '男' : '女'} · {b.birthDate}
            </span>
          )}
          <span className="text-xs text-stone-400">
            {new Date(record.createdAt).toLocaleString('zh-CN', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <span
              onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
              className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all text-sm p-1"
              title="删除记录"
            >
              🗑️
            </span>
          )}
          <span className={`text-stone-400 text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Analysis */}
      <div
        onClick={() => !expanded && setExpanded(true)}
        className={`cursor-pointer ${expanded ? '' : 'cursor-pointer'}`}
      >
        {expanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 py-4 markdown-body"
          >
            <ReactMarkdown>{record.analysis}</ReactMarkdown>
          </motion.div>
        ) : (
          <div className="px-5 py-4">
            <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap line-clamp-5">
              {record.analysis}
            </div>
            <div className="text-xs text-amber-500 mt-2 font-medium">
              点击查看完整分析 →
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
