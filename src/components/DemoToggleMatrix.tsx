import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Demo } from '../data';
import GridDisplay from './Grid';

interface Props {
  demos: Demo[];
  enabled: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  showGravity?: boolean;
}

export default function DemoToggleMatrix({
  demos,
  enabled,
  onToggle,
  onSelectAll,
  onClearAll,
  showGravity = false,
}: Props) {
  const allOn = demos.every((d) => enabled.has(d.id));
  const allOff = demos.every((d) => !enabled.has(d.id));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <span className="text-xl">🎛️</span> Demonstration Toggles
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allOn}
            className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200
                       hover:bg-emerald-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            disabled={allOff}
            className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200
                       hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {demos.map((demo) => {
            const isOn = enabled.has(demo.id);
            return (
              <motion.div
                key={demo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onToggle(demo.id)}
                className={`
                  relative cursor-pointer rounded-2xl p-4 border transition-all duration-200
                  ${isOn
                    ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100/30'
                    : 'bg-white/40 border-stone-200 opacity-60 hover:opacity-80 hover:bg-white/60'}
                `}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isOn ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-stone-400" />
                    </motion.div>
                  )}
                </div>

                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  {isOn ? (
                    <ToggleRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-stone-300" />
                  )}
                  <span className="text-sm font-bold text-stone-700">{demo.label}</span>
                </div>

                <p className="text-[11px] text-stone-400 mb-3 pr-6">{demo.description}</p>

                {/* Mini Grids: Input → Output */}
                <div className="flex items-center justify-center gap-3">
                  <GridDisplay grid={demo.inputGrid} size={56} showGravity={showGravity} />
                  <span className="text-stone-300 text-lg">→</span>
                  <GridDisplay grid={demo.outputGrid} size={56} showGravity={showGravity} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
