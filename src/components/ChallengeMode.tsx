import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { CHALLENGES, type ChallengeLevel } from '../data';

export default function ChallengeMode() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const challenge: ChallengeLevel | undefined = CHALLENGES[currentLevel];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === challenge.correctAnswer) {
      setScore((s) => s + 1);
      setCompleted((prev) => new Set([...prev, challenge.id]));
    }
  };

  const nextLevel = () => {
    if (currentLevel < CHALLENGES.length - 1) {
      setCurrentLevel((l) => l + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const reset = () => {
    setCurrentLevel(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(new Set());
    setShowHint(false);
  };

  if (!challenge) return null;

  const typeIcons: Record<string, string> = {
    'find-missing': '🔍',
    'predict-spurious': '🔮',
    'minimal-set': '🧩',
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <span className="text-2xl">🎯</span> Coverage Detective
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold">
            <Trophy className="w-4 h-4" />
            <span>{score}/{CHALLENGES.length}</span>
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-xl bg-stone-100 border border-stone-200
                       hover:bg-stone-200 transition text-stone-500 hover:text-stone-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Progress */}
      <div className="flex gap-2">
        {CHALLENGES.map((c, i) => (
          <div
            key={c.id}
            className={`
              flex-1 h-2 rounded-full transition-all duration-500
              ${completed.has(c.id)
                ? 'bg-emerald-400'
                : i === currentLevel
                  ? 'bg-amber-400'
                  : 'bg-stone-200'}
            `}
          />
        ))}
      </div>

      {/* Challenge Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm"
        >
          {/* Level Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              Level {challenge.id}
            </span>
            <span className="text-lg">{typeIcons[challenge.type]}</span>
          </div>

          <h3 className="text-base font-bold text-stone-800">{challenge.title}</h3>
          <p className="text-sm text-stone-500 leading-relaxed">{challenge.description}</p>

          {/* Options */}
          <div className="space-y-2">
            {challenge.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isRight = option === challenge.correctAnswer;
              let style = 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-white cursor-pointer';
              if (showResult && isSelected && isRight) style = 'bg-emerald-50 border-emerald-300';
              else if (showResult && isSelected && !isRight) style = 'bg-red-50 border-red-300';
              else if (showResult && isRight) style = 'bg-emerald-50/50 border-emerald-200';

              return (
                <motion.button
                  key={option}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${style}`}
                >
                  <div className="flex items-center gap-2">
                    {showResult && isRight && <Star className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {showResult && isSelected && !isRight && <span className="text-red-500">✗</span>}
                    <span className={showResult && isRight ? 'text-emerald-700 font-semibold' : 'text-stone-600'}>
                      {option}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Hint */}
          {!showResult && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition"
            >
              <HelpCircle className="w-4 h-4" />
              {showHint ? 'Hide hint' : 'Need a hint?'}
            </button>
          )}

          <AnimatePresence>
            {showHint && !showResult && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3 border border-amber-200">
                  💡 {challenge.hint}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 text-sm border ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {isCorrect ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span><strong>Correct!</strong> You identified the coverage gap. +1</span>
                  </div>
                ) : (
                  <span>The correct answer was: <strong>{challenge.correctAnswer}</strong>. Think about which rules each demo covers.</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {showResult && currentLevel < CHALLENGES.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={nextLevel}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         bg-teal-600 text-white hover:bg-teal-700 transition text-sm font-semibold
                         shadow-sm shadow-teal-200"
            >
              Next Challenge <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          {/* Completion */}
          {showResult && currentLevel === CHALLENGES.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-base font-bold text-stone-800">
                {score === CHALLENGES.length
                  ? 'Perfect Score! You\'re a Coverage Master!'
                  : `You scored ${score}/${CHALLENGES.length}. Keep practicing!`}
              </p>
              <p className="text-sm text-stone-500 mt-1">Come back tomorrow for a fresh challenge!</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
