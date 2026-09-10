import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BDHCQSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-3">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/50 p-5"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <h2 className="text-base font-bold text-stone-800 mb-1">
              BDH-CQ Connection
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              BDH-CQ learns from demonstrations using recurrent memory on ARC-style puzzles;
              this demo is a <strong className="text-stone-700">tiny, honest toy</strong> that isolates
              the <em className="text-teal-600">coverage → extrapolation</em> lesson.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Expandable Deep Dive */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl
                   bg-white border border-stone-200 hover:border-stone-300
                   transition text-left shadow-sm"
      >
        <span className="text-sm font-semibold text-stone-700">
          📚 Deep Dive: How BDH-CQ Works
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-stone-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-5">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-bold text-teal-700 mb-2">Overview</h3>
                <ul className="text-sm text-stone-500 space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">▸</span>
                    <span><strong className="text-stone-700">150M parameters</strong> trained on ARC-style puzzles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">▸</span>
                    <span><strong className="text-stone-700">29.5%</strong> on ARC-AGI-1 benchmark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">▸</span>
                    <span><strong className="text-stone-700">$0.0007/task</strong> — extremely efficient inference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">▸</span>
                    <span>Uses <strong className="text-stone-700">Demo-Based Hypothesis</strong> with <strong className="text-stone-700">Compositional Queries</strong></span>
                  </li>
                </ul>
              </div>

              {/* Key Equations */}
              <div>
                <h3 className="text-sm font-bold text-teal-700 mb-2">Key Equations</h3>
                <div className="space-y-2">
                  <div className="bg-stone-50 rounded-xl px-4 py-3 font-mono text-sm text-amber-700 border border-stone-200">
                    <span className="text-stone-400">Memory:</span>{' '}
                    M<sub>t+1</sub> = M<sub>t</sub> + η · k<sub>t</sub> ⊗ v<sub>t</sub>
                  </div>
                  <div className="bg-stone-50 rounded-xl px-4 py-3 font-mono text-sm text-amber-700 border border-stone-200">
                    <span className="text-stone-400">Query:</span>{' '}
                    y* = decode(M<sub>T</sub>, x*)
                  </div>
                </div>
              </div>

              {/* Mapping */}
              <div>
                <h3 className="text-sm font-bold text-teal-700 mb-2">Toy → Real Mapping</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <div className="text-stone-400 text-xs mb-2 font-semibold">This Toy</div>
                    <ul className="text-stone-600 space-y-1">
                      <li>• 3 demos, 2 rules</li>
                      <li>• 5×5 grids</li>
                      <li>• Random projections</li>
                    </ul>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <div className="text-stone-400 text-xs mb-2 font-semibold">BDH-CQ</div>
                    <ul className="text-stone-600 space-y-1">
                      <li>• Sparse demos, many rules</li>
                      <li>• 30×30 ARC puzzles</li>
                      <li>• Trained parameters</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Limitations */}
              <div className="flex items-start gap-2 text-sm text-stone-500 bg-amber-50/50 rounded-xl p-4 border border-amber-200/60">
                <span className="text-amber-500">⚠️</span>
                <span>
                  <strong className="text-stone-700">Limitations:</strong> This toy uses random projections
                  and hand-coded rules. BDH-CQ has 150M learned parameters, attention mechanisms,
                  and trains on thousands of puzzles. The core lesson transfers, but the mechanics are vastly more sophisticated.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
