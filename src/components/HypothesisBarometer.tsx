import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Rule } from '../data';

interface Props {
  rules: Rule[];
  enabledDemos: Set<string>;
}

export default function HypothesisBarometer({ rules, enabledDemos }: Props) {
  const coveredCount = rules.filter((r) => enabledDemos.has(r.coveredBy)).length;
  const totalCount = rules.length;
  const pct = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0;
  const fullCoverage = coveredCount === totalCount;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
      <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
        <span className="text-xl">📐</span> Rule Coverage
      </h2>

      {/* Coverage Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-stone-400">Coverage</span>
          <span className={`font-bold ${fullCoverage ? 'text-emerald-600' : 'text-amber-600'}`}>
            {coveredCount}/{totalCount} rules — {pct}%
          </span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
          <motion.div
            className={`h-full rounded-full ${fullCoverage ? 'bg-emerald-400' : 'bg-amber-400'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Rule Cards */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {rules.map((rule) => {
            const isCovered = enabledDemos.has(rule.coveredBy);
            return (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                  ${isCovered
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-red-50/50 border-red-200'}
                `}
              >
                {isCovered ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-stone-700">
                    {rule.label}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {isCovered
                      ? `Covered by ${rule.coveredBy.toUpperCase()}`
                      : `⚠️ NOT covered — ${rule.coveredBy.toUpperCase()} is off`}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCovered
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {isCovered ? 'ACTIVE' : 'MISSING'}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
