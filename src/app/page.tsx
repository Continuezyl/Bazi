'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const child = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div variants={child} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/50 text-amber-700 text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-soft" />
              基于 DeepSeek V4 驱动
            </motion.div>

            <motion.h1
              variants={child}
              className="text-5xl sm:text-6xl font-bold tracking-tight text-[#4a3020] mb-4"
            >
              探索
              <span className="gradient-text"> 八字命理 </span>
              的奥秘
            </motion.h1>

            <motion.p
              variants={child}
              className="text-lg text-stone-500 max-w-lg mx-auto leading-relaxed mb-10"
            >
              AI 智能八字排盘，融合传统命理学与现代科技，解读天干地支、五行生克，探索人生运势
            </motion.p>

            <motion.div variants={child}>
              <Link
                href="/bazi"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 hover:-translate-y-0.5 transition-all duration-200 text-lg"
              >
                ☯ 开始八字排盘
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-md mx-auto px-4 mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        <div className="flex justify-center -mt-2.5">
          <span className="bg-amber-50 px-3 text-lg">☯</span>
        </div>
      </div>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            {
              icon: '☯',
              title: '八字排盘',
              desc: '输入出生年月日时，AI 自动推算四柱八字、十神、五行',
              href: '/bazi',
              gradient: 'from-amber-50 to-orange-50',
            },
            {
              icon: '⚖️',
              title: '五行分析',
              desc: '分析五行旺衰、喜用神，揭示先天禀赋与后天运势',
              href: '/bazi',
              gradient: 'from-rose-50 to-amber-50',
            },
            {
              icon: '🧠',
              title: 'AI 对话',
              desc: 'DeepSeek V4 深度命理分析，专业八字知识即时解答',
              href: '/bazi',
              gradient: 'from-stone-50 to-amber-50',
            },
            {
              icon: '📋',
              title: '分析记录',
              desc: '记录完全本地保存，随时回顾过往命理分析',
              href: '/history',
              gradient: 'from-amber-50 to-yellow-50',
            },
          ].map((f, i) => (
            <motion.div key={f.title} variants={child}>
              <Link
                href={f.href}
                className={`group block p-6 rounded-3xl bg-gradient-to-br ${f.gradient} border border-amber-100/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="text-4xl mb-4 group-hover:animate-float">{f.icon}</div>
                <h3 className="font-bold text-[#4a3020] mb-1.5">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-amber-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  立即体验 <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-10"
        >
          <div className="text-4xl mb-4">☯</div>
          <h2 className="text-2xl font-bold text-[#4a3020] mb-3">准备好了解自己的八字了吗？</h2>
          <p className="text-stone-500 mb-6 leading-relaxed">
            AI 命理分析，仅供参考娱乐。保持好奇心，探索传统智慧。
          </p>
          <Link href="/bazi" className="inline-flex px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
            开始八字排盘
          </Link>
        </motion.div>
      </section>
    </>
  );
}
