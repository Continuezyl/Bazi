'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import ChatPanel from '@/components/ChatPanel';
import { addReading } from '@/lib/storage';
import type { BaziInput } from '@/lib/types';

const SHICHEN = [
  { label: '子时 (23:00-00:59)', value: '23:00' },
  { label: '丑时 (01:00-02:59)', value: '01:00' },
  { label: '寅时 (03:00-04:59)', value: '03:00' },
  { label: '卯时 (05:00-06:59)', value: '05:00' },
  { label: '辰时 (07:00-08:59)', value: '07:00' },
  { label: '巳时 (09:00-10:59)', value: '09:00' },
  { label: '午时 (11:00-12:59)', value: '11:00' },
  { label: '未时 (13:00-14:59)', value: '13:00' },
  { label: '申时 (15:00-16:59)', value: '15:00' },
  { label: '酉时 (17:00-18:59)', value: '17:00' },
  { label: '戌时 (19:00-20:59)', value: '19:00' },
  { label: '亥时 (21:00-22:59)', value: '21:00' },
];

function buildSystemPrompt(input: BaziInput): string {
  return `你是一位资深的八字命理大师，精通中国传统八字排盘、十神分析、五行生克、大运流年等。

用户信息：
- 姓名：${input.name || '未提供'}
- 性别：${input.gender === 'male' ? '男' : '女'}
- 出生日期：${input.birthDate}（${input.isLunar ? '农历' : '阳历'}）
- 出生时间：${input.birthTime}

请用 Markdown 格式输出清晰的八字分析报告，格式要求：

- 用 ## 标题分隔每个板块
- 用 - 或数字列表列出要点
- 重要内容用 **粗体** 突出
- 板块间用 --- 分隔
- 五行用 emoji 表示（🪵木 🔥火 🌍土 ⚔️金 💧水）

## 一、八字排盘
列出年柱、月柱、日柱、时柱的天干地支，用 Markdown 表格呈现。

## 二、五行分析
统计五行数量，分析旺衰和平衡性。

## 三、十神格局
根据日干分析十神关系。

## 四、命局解读
逐项分析：性格、事业财运、感情婚姻、健康。

## 五、喜用神建议
给出喜神、用神及生活建议。

## 六、综合评分
给出整体评分（满分100）。

最后用 > 引用格式写上温馨提示。`;
}

export default function BaziPage() {
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [isLunar, setIsLunar] = useState(false);
  const [baziInput, setBaziInput] = useState<BaziInput | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    const input: BaziInput = { name, gender, birthDate, birthTime, isLunar };
    setBaziInput(input);
    setSystemPrompt(buildSystemPrompt(input));
    setStep('chat');
  };

  const handleAnalysisReady = (content: string) => {
    if (!saved && baziInput && content) {
      addReading({
        id: uuid(),
        type: 'bazi',
        baziInput,
        analysis: content,
        createdAt: new Date().toISOString(),
      });
      setSaved(true);
    }
  };

  if (step === 'chat' && baziInput) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="text-4xl mb-2">☯</div>
          <h1 className="text-2xl font-bold text-[#4a3020] mb-1">八字排盘分析</h1>
          <p className="text-sm text-stone-400">
            {baziInput.name || '用户'} · {baziInput.gender === 'male' ? '男' : '女'} · {baziInput.birthDate} · {SHICHEN.find(s => s.value === baziInput.birthTime)?.label.split(' ')[0] || baziInput.birthTime}
          </p>
          <button
            onClick={() => { setStep('form'); setSaved(false); }}
            className="mt-2 text-xs text-amber-500 hover:text-amber-600 underline"
          >
            修改信息
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChatPanel
            systemPrompt={systemPrompt}
            autoSend="请为我进行完整的八字排盘和命理分析"
            placeholder="继续提问，深入了解你的八字..."
            onAnalysisReady={handleAnalysisReady}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-3">☯</div>
        <h1 className="text-3xl font-bold text-[#4a3020] mb-2">八字排盘</h1>
        <p className="text-stone-400">输入出生信息，AI 为你推算八字命理</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 space-y-5"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#4a3020] mb-1.5">姓名</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入姓名（选填）"
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200/60 bg-white text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-[#4a3020] mb-1.5">性别</label>
          <div className="flex gap-3">
            {[
              { value: 'male' as const, label: '男' },
              { value: 'female' as const, label: '女' },
            ].map(g => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGender(g.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  gender === g.value
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-amber-200 text-stone-500 hover:border-amber-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-[#4a3020] mb-1.5">出生日期</label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200/60 bg-white text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>

        {/* Birth Time */}
        <div>
          <label className="block text-sm font-medium text-[#4a3020] mb-1.5">出生时辰</label>
          <select
            value={birthTime}
            onChange={e => setBirthTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200/60 bg-white text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          >
            {SHICHEN.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Lunar toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLunar(!isLunar)}
            className={`relative w-11 h-6 rounded-full transition-colors ${isLunar ? 'bg-amber-500' : 'bg-stone-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isLunar ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-stone-600">
            {isLunar ? '农历日期' : '阳历日期'}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!birthDate}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-amber-200"
        >
          开始排盘分析
        </button>
      </motion.form>
    </div>
  );
}
