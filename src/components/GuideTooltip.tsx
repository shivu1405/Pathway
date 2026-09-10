import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

interface Props {
  suiteId: string;
  enabledDemos: Set<string>;
}

const TIPS: Record<string, { trigger: (demos: Set<string>) => boolean; message: string }[]> = {
  barrier: [
    {
      trigger: (d) => d.size === 3,
      message: '✨ Try turning OFF Demo 2 to see what happens when the barrier rule is missing!',
    },
    {
      trigger: (d) => !d.has('d2') && d.has('d1'),
      message: '⚠️ Without Demo 2, the model never learns about barriers. Watch the test prediction fail!',
    },
    {
      trigger: (d) => d.size === 0,
      message: '🔮 No demos = no rules learned. The model is blind. Try selecting at least one!',
    },
  ],
  parity: [
    {
      trigger: (d) => d.size === 3,
      message: '✨ Try turning OFF Demo 2 to see what happens when inversion is never shown!',
    },
    {
      trigger: (d) => !d.has('d2') && d.has('d1'),
      message: '⚠️ Demos 1 & 3 both show odd-sized shapes copying. The model learns "always copy" — wrong!',
    },
    {
      trigger: (d) => d.size === 0,
      message: '🔮 With no demos, the model has no rules. Select some to see the magic!',
    },
  ],
};

export default function GuideTooltip({ suiteId, enabledDemos }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const tips = TIPS[suiteId] || [];
  const activeTip = tips.find((t) => t.trigger(enabledDemos));

  if (!activeTip || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={activeTip.message}
        initial={{ opacity: 0, y: -5, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -5, height: 0 }}
        className="overflow-hidden"
      >
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/60 text-sm text-amber-700">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span className="flex-1 leading-relaxed">{activeTip.message}</span>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-0.5 rounded hover:bg-amber-100 transition text-amber-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
