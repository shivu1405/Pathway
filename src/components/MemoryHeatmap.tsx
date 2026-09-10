import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { generateHeatmap } from '../data';

interface Props {
  demoCount: number;
  enabledCount: number;
  enabledIndices: number[];
}

const HEATMAP_SIZE = 12;

function interpolateColor(value: number): string {
  // Warm cream → teal
  const r = Math.round(250 - value * 180);
  const g = Math.round(245 - value * 100);
  const b = Math.round(235 - value * 90);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function MemoryHeatmap({ enabledCount, enabledIndices }: Props) {
  const heatmap = useMemo(() => {
    const accumulated = Array.from({ length: HEATMAP_SIZE }, () =>
      Array(HEATMAP_SIZE).fill(0)
    );

    for (const idx of enabledIndices) {
      const demoHeat = generateHeatmap(idx + 1, HEATMAP_SIZE);
      for (let r = 0; r < HEATMAP_SIZE; r++) {
        for (let c = 0; c < HEATMAP_SIZE; c++) {
          accumulated[r][c] += demoHeat[r][c];
        }
      }
    }

    const maxVal = Math.max(...accumulated.flat(), 1);
    return accumulated.map((row) =>
      row.map((v) => Math.tanh(v / maxVal * 2))
    );
  }, [enabledIndices]);

  const cellPx = Math.floor(240 / HEATMAP_SIZE);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
      <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
        <span className="text-xl">🧠</span> Memory State
      </h2>
      <p className="text-xs text-stone-400 leading-relaxed">
        Latent state after {enabledCount} demo{enabledCount !== 1 ? 's' : ''}. Memory accumulates rules sequentially.
      </p>

      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="rounded-xl border border-stone-200 overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${HEATMAP_SIZE}, ${cellPx}px)`,
            gap: '2px',
            padding: '3px',
            background: '#f5f0eb',
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {heatmap.flatMap((row, r) =>
            row.map((val, c) => (
              <motion.div
                key={`${r}-${c}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, backgroundColor: interpolateColor(val) }}
                transition={{
                  delay: (r * HEATMAP_SIZE + c) * 0.008,
                  duration: 0.3,
                }}
                style={{
                  width: cellPx,
                  height: cellPx,
                  borderRadius: '3px',
                }}
              />
            ))
          )}
        </motion.div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] text-stone-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: interpolateColor(0) }} />
            <span>Low</span>
          </div>
          <div className="w-16 h-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #faf5ef, #0d9488)' }} />
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: interpolateColor(1) }} />
            <span>High</span>
          </div>
        </div>

        <p className="text-[10px] text-stone-400 font-mono">
          h<sub>t+1</sub> = tanh(h<sub>t</sub> + η · encode(demo<sub>t</sub>))
        </p>
      </div>
    </section>
  );
}
