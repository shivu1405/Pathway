import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, ChevronRight, Sparkles } from 'lucide-react';
import { SUITES } from './data';
import DemoToggleMatrix from './components/DemoToggleMatrix';
import MemoryHeatmap from './components/MemoryHeatmap';
import HypothesisBarometer from './components/HypothesisBarometer';
import TestArena from './components/TestArena';
import BDHCQSection from './components/BDHCQSection';
import ChallengeMode from './components/ChallengeMode';
import GuideTooltip from './components/GuideTooltip';
import ChatBot from './components/ChatBot';

type Tab = 'sandbox' | 'challenge';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sandbox');
  const [suiteIdx, setSuiteIdx] = useState(0);
  const [enabledDemos, setEnabledDemos] = useState<Set<string>>(
    new Set(SUITES[0].demos.map((d) => d.id))
  );

  const suite = SUITES[suiteIdx];

  const handleToggle = useCallback((id: string) => {
    setEnabledDemos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setEnabledDemos(new Set(suite.demos.map((d) => d.id)));
  }, [suite]);

  const handleClearAll = useCallback(() => {
    setEnabledDemos(new Set());
  }, []);

  const switchSuite = useCallback((idx: number) => {
    setSuiteIdx(idx);
    setEnabledDemos(new Set(SUITES[idx].demos.map((d) => d.id)));
  }, []);

  const enabledIndices = useMemo(
    () =>
      suite.demos
        .map((d, i) => (enabledDemos.has(d.id) ? i : -1))
        .filter((i) => i >= 0),
    [suite, enabledDemos]
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800">
      {/* ── Hero Header ── */}
      <header className="border-b border-stone-200/80 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                  DataForge 2026 — Pathway Track
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Coverage → Extrapolation
              </h1>
              <p className="text-sm text-stone-500 mt-2 max-w-lg leading-relaxed">
                If examples don't cover every rule, the model learns a{' '}
                <span className="text-coral font-semibold" style={{ color: '#e74c3c' }}>simpler, wrong rule</span> and fails on new cases.
              </p>
            </div>
            <div className="hidden sm:block text-right text-[11px] text-stone-400 max-w-[200px]">
              <div className="font-mono text-stone-500">Case Study: BDH-CQ</div>
              <div className="mt-0.5">Demo-Based Hypothesis + Compositional Queries</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <div className="sticky top-0 z-20 bg-[#faf8f5]/90 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
          {[
            { id: 'sandbox' as Tab, label: 'Sandbox', icon: Beaker },
            { id: 'challenge' as Tab, label: 'Coverage Detective', icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-[1px]
                ${activeTab === id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-stone-400 hover:text-stone-600'}
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'sandbox' ? (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* ── Contextual Guide ── */}
              <GuideTooltip suiteId={suite.id} enabledDemos={enabledDemos} />

              {/* ── Suite Selector ── */}
              <div className="flex gap-3">
                {SUITES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => switchSuite(i)}
                    className={`
                      flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all
                      ${suiteIdx === i
                        ? 'bg-white border-teal-300 text-teal-700 shadow-md shadow-teal-100/50 ring-1 ring-teal-200/30'
                        : 'bg-white/60 border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300 hover:bg-white'}
                    `}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="text-left">
                      <div>{s.name}</div>
                      <div className="text-[10px] font-normal text-stone-400">{s.subtitle}</div>
                    </div>
                    {suiteIdx === i && <ChevronRight className="w-4 h-4 ml-1 text-teal-500" />}
                  </button>
                ))}
              </div>

              {/* ── One-Sentence Claim ── */}
              <motion.div
                key={suite.id + '-claim'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-stone-200 bg-white/80 px-5 py-4"
              >
                <p className="text-sm text-stone-500 leading-relaxed">
                  <span className="text-stone-700 font-bold">Core Claim:</span>{' '}
                  A model that learns from examples only works on new cases if those examples
                  together cover every important rule. If any part of the rule is never shown,
                  the model learns a simpler, wrong rule and fails.
                </p>
              </motion.div>

              {/* ── Main Grid Layout ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Demos + Test */}
                <div className="lg:col-span-2 space-y-6">
                  <DemoToggleMatrix
                    demos={suite.demos}
                    enabled={enabledDemos}
                    onToggle={handleToggle}
                    onSelectAll={handleSelectAll}
                    onClearAll={handleClearAll}
                    showGravity={suite.id === 'barrier'}
                  />
                  <TestArena
                    test={suite.test}
                    rules={suite.rules}
                    enabledDemos={enabledDemos}
                    showGravity={suite.id === 'barrier'}
                  />
                </div>

                {/* Right Column: Memory + Rules */}
                <div className="space-y-6">
                  <MemoryHeatmap
                    demoCount={suite.demos.length}
                    enabledCount={enabledDemos.size}
                    enabledIndices={enabledIndices}
                  />
                  <HypothesisBarometer
                    rules={suite.rules}
                    enabledDemos={enabledDemos}
                  />
                </div>
              </div>

              {/* ── BDH-CQ Connection ── */}
              <BDHCQSection />
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-2xl mx-auto"
            >
              <ChallengeMode />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200/60 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-[11px] text-stone-400">
          DataForge 2026 Pathway Track — Demonstration Coverage and Extrapolation — BDH-CQ Case Study
        </div>
      </footer>

      {/* ── Chat Bot ── */}
      <ChatBot />
    </div>
  );
}
