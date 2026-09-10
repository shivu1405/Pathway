import { motion } from 'framer-motion';
import { COLORS, type Grid as GridType } from '../data';

interface GridProps {
  grid: GridType;
  size?: number;
  label?: string;
  highlightErrors?: boolean;
  compareGrid?: GridType;
  showGravity?: boolean;
  className?: string;
}

export default function GridDisplay({
  grid,
  size = 100,
  label,
  highlightErrors = false,
  compareGrid,
  showGravity = false,
  className = '',
}: GridProps) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const cellSize = size / Math.max(rows, cols);

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          {label}
        </span>
      )}
      <div className="relative">
        {showGravity && (
          <motion.div
            className="absolute -right-5 top-0 bottom-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          >
            <div className="text-stone-400 text-[10px] font-mono mb-0.5">↓</div>
            <div className="w-[1px] h-full bg-gradient-to-b from-stone-300 to-stone-400" />
            <div className="text-stone-400 text-[9px] mt-0.5">G</div>
          </motion.div>
        )}
        <div
          className="rounded-xl border border-stone-200 overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            background: COLORS.grid,
            gap: '1px',
            padding: '2px',
          }}
        >
          {grid.flatMap((row, r) =>
            row.map((cell, c) => {
              const isDiff =
                highlightErrors && compareGrid && cell !== compareGrid[r][c];
              return (
                <motion.div
                  key={`${r}-${c}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (r * cols + c) * 0.015, duration: 0.25 }}
                  className="rounded-[3px]"
                  style={{
                    background: cell ? COLORS[cell] || cell : '#faf8f5',
                    boxShadow: isDiff ? '0 0 0 2px #e74c3c, 0 0 8px rgba(231,76,60,0.3)' : 'none',
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
