import { motion } from 'framer-motion';
import type { TestCase, Rule } from '../data';
import GridDisplay from './Grid';

interface Props {
  test: TestCase;
  rules: Rule[];
  enabledDemos: Set<string>;
  showGravity?: boolean;
}

export default function TestArena({ test, rules, enabledDemos, showGravity = false }: Props) {
  const coveredCount = rules.filter((r) => enabledDemos.has(r.coveredBy)).length;
  const totalCount = rules.length;
  const fullCoverage = coveredCount === totalCount;
  const pct = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5">
      <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
        <span className="text-xl">🧪</span> Extrapolation Test
      </h2>

      {/* Test Input */}
      <div className="flex justify-center">
        <GridDisplay grid={test.inputGrid} size={120} label="Novel Test Input" showGravity={showGravity} />
      </div>

      {/* Prediction vs Truth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Model Prediction */}
        <motion.div
          layout
          className={`rounded-2xl p-5 border ${
            fullCoverage
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-red-50/50 border-red-200'
          }`}
        >
          <div className="text-center mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              fullCoverage
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}>
              {fullCoverage ? '✓ Model Prediction (ŷ*)' : '✗ Model Prediction (ŷ*)'}
            </span>
          </div>
          <div className="flex justify-center">
            <GridDisplay
              grid={fullCoverage ? test.correctOutput : test.wrongOutput}
              size={120}
              highlightErrors={!fullCoverage}
              compareGrid={test.correctOutput}
            />
          </div>
        </motion.div>

        {/* Ground Truth */}
        <div className="rounded-2xl p-5 border border-stone-200 bg-stone-50/50">
          <div className="text-center mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-200 text-stone-600">
              ★ Ground Truth (y*)
            </span>
          </div>
          <div className="flex justify-center">
            <GridDisplay grid={test.correctOutput} size={120} />
          </div>
        </div>
      </div>

      {/* Coverage Score */}
      <div className="text-center">
        <motion.div
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border ${
            fullCoverage
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {coveredCount}/{totalCount} rules covered → {pct}% coverage
        </motion.div>
      </div>

      {/* Diagnostic Message */}
      <motion.div
        key={fullCoverage ? 'good' : 'bad'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 border text-sm leading-relaxed ${
          fullCoverage
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}
      >
        {fullCoverage ? (
          <span>✅ <strong>All rule invariants covered!</strong> Latent memory correctly extrapolates to the novel input.</span>
        ) : (
          <span>⚠️ <strong>Incomplete coverage.</strong> {test.wrongExplanation}</span>
        )}
      </motion.div>

      {/* Error Delta */}
      {!fullCoverage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider text-center">
            Error Delta — where prediction ≠ truth
          </h3>
          <div className="flex justify-center">
            <GridDisplay
              grid={test.correctOutput}
              size={100}
              highlightErrors={true}
              compareGrid={test.wrongOutput}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
