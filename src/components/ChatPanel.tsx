'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/lib/types';

interface Props {
  systemPrompt: string;
  placeholder?: string;
  autoSend?: string;
  onAnalysisReady?: (content: string) => void;
}

export default function ChatPanel({ systemPrompt, placeholder, autoSend, onAnalysisReady }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAutoSent = useRef(false);
  const systemPromptRef = useRef(systemPrompt);
  systemPromptRef.current = systemPrompt;
  const onAnalysisReadyRef = useRef(onAnalysisReady);
  onAnalysisReadyRef.current = onAnalysisReady;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Auto-send on mount (must be before sendMessage definition)
  useEffect(() => {
    if (!autoSend || hasAutoSent.current) return;
    hasAutoSent.current = true;

    const run = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      const userMsg: ChatMessage = { role: 'user', content: autoSend };
      setMessages([userMsg]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'system', content: systemPromptRef.current }, userMsg] }),
        });

        if (!res.ok) {
          const err = await res.json();
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ 错误: ${err.error}` }]);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let full = '';
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const { content } = JSON.parse(line.slice(6));
                if (content) {
                  full += content;
                  setMessages(prev => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: 'assistant', content: full };
                    return copy;
                  });
                }
              } catch {}
            }
          }
        }
        onAnalysisReadyRef.current?.(full);
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: '❌ 网络错误，请重试' }]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };
    run();
  }, [autoSend]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    const text = input.trim();
    if (!text || loadingRef.current) return;
    setInput('');
    loadingRef.current = true;
    setLoading(true);
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'system', content: systemPromptRef.current }, userMsg] }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ 错误: ${err.error}` }]);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const { content } = JSON.parse(line.slice(6));
              if (content) {
                full += content;
                setMessages(prev => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: 'assistant', content: full };
                  return copy;
                });
              }
            } catch {}
          }
        }
      }
      onAnalysisReadyRef.current?.(full);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ 网络错误，请重试' }]);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[500px] max-h-[calc(100vh-280px)] glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-amber-100/50 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-300" />
        <span className="text-sm font-semibold text-[#4a3020]">AI 命理助手</span>
        <span className="text-xs text-stone-400 ml-auto">DeepSeek V4</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="text-4xl mb-3 animate-float">🤖</div>
            <p className="text-stone-500 text-sm font-medium mb-1">AI 命理助手已就绪</p>
            <p className="text-stone-400 text-xs max-w-[240px] leading-relaxed">
              输入你的问题，AI 将为你深度解读八字命理
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xs mr-2 mt-1 shrink-0 shadow-sm">
                  🤖
                </div>
              )}
              <div className={`${
                m.role === 'user'
                  ? 'max-w-[82%] px-4 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-br-md shadow-sm text-sm'
                  : 'w-full px-5 py-4 rounded-2xl bg-stone-100 text-stone-700 rounded-bl-md text-sm markdown-body'
              }`}>
                {typeof m.content === 'string' && m.content ? (
                  m.role === 'assistant' ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )
                ) : (
                  <span className="flex items-center gap-1 text-stone-400">
                    <span className="animate-pulse-soft">●</span> 思考中...
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 border-t border-amber-100/50 flex gap-2.5 bg-amber-50/30">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={placeholder || '描述特征，让 AI 为你分析...'}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200/60 bg-white text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:opacity-50 transition-all placeholder:text-stone-350"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-amber-200"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <span className="animate-pulse-soft">●</span>
            </span>
          ) : '发送'}
        </button>
      </div>
    </div>
  );
}
