'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: '首页' },
  { href: '/bazi', label: '八字排盘' },
  { href: '/history', label: '记录' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-amber-100/30">
      <div className="max-w-5xl mx-auto px-5 h-15 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:animate-float">🔮</span>
          <span className="font-bold text-lg text-[#4a3020] tracking-tight">
            Kxiang <span className="text-amber-600">八字</span>
          </span>
        </Link>

        <div className="flex gap-0.5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  active ? 'text-amber-800' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-amber-100/80 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
