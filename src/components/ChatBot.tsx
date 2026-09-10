import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const KNOWLEDGE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['what is coverage', 'coverage mean', 'define coverage', 'coverage?'],
    answer: "Coverage means your training examples collectively demonstrate every rule the model needs to learn. If you have 3 rules but only show examples of 2, you have 67% coverage. The missing rule becomes a blind spot.",
  },
  {
    keywords: ['extrapolation', 'extrapolate', 'new cases', 'generalize'],
    answer: "Extrapolation is the model's ability to correctly handle NEW inputs it hasn't seen before. It can only do this if the rules it learned from demonstrations are complete. Missing rules = wrong predictions on novel inputs.",
  },
  {
    keywords: ['bdh-cq', 'bdh', 'what is bdh', 'bdhcq'],
    answer: "BDH-CQ (Demo-Based Hypothesis + Compositional Queries) is a 150M parameter model that learns from demonstrations to solve ARC-style puzzles. It achieves 29.5% on ARC-AGI-1 at just $0.0007/task. It stores demonstrations in a recurrent memory and uses that memory to answer new queries.",
  },
  {
    keywords: ['memory', 'recurrent', 'latent', 'state'],
    answer: "The model's recurrent memory accumulates information from each demonstration: h(t+1) = tanh(h(t) + η·encode(demo_t)). Each demo updates the latent state. If a demo is missing, the memory never encodes that rule, creating a blind spot.",
  },
  {
    keywords: ['barrier', 'gravity', 'suite a', 'falling'],
    answer: "Suite A demonstrates gravity + barrier rules. Blocks fall down (gravity rule) but stop when hitting a platform (barrier rule). If you remove Demo 2, the model never sees a barrier → it learns 'blocks always fall to the floor' and ghosts through barriers on new inputs.",
  },
  {
    keywords: ['parity', 'color', 'inversion', 'suite b', 'odd', 'even'],
    answer: "Suite B shows parity-based rules: odd-sized shapes copy unchanged, even-sized shapes get color-inverted. Without Demo 2 (the only even-size example), the model learns 'always copy' and fails to invert 4×4 shapes.",
  },
  {
    keywords: ['spurious', 'wrong rule', 'simpler', 'shortcut'],
    answer: "When a rule is never demonstrated, the model doesn't learn 'nothing' — it learns a WRONG, simpler rule that fits the available examples. This is called a spurious rule. For example, seeing only odd-copy demos, it learns 'all shapes copy' instead of 'only odd shapes copy'.",
  },
  {
    keywords: ['demo', 'demonstration', 'example', 'training'],
    answer: "Demonstrations are input→output pairs that teach the model rules. Each demo covers specific rules. The key insight: it's not about quantity — it's about COVERAGE. 100 demos of the same rule teach less than 2 demos covering different rules.",
  },
  {
    keywords: ['minimal', 'fewest', 'smallest set', 'enough demos'],
    answer: "The minimal demo set is the smallest collection that covers ALL rules. For Suite A: Demos 1 & 2 (gravity + barrier). For Suite B: Demos 1 & 2 (odd-copy + even-invert). Demo 3 in each suite is redundant — it reinforces but doesn't add new rule coverage.",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'who are you'],
    answer: "Hey! 👋 I'm your Coverage Detective helper. Ask me anything about demonstration coverage, extrapolation, BDH-CQ, or the puzzle suites. Try: 'What is coverage?' or 'Explain Suite A'",
  },
  {
    keywords: ['help', 'what can', 'how to', 'guide'],
    answer: "You can ask me about:\n• Coverage & extrapolation concepts\n• How BDH-CQ works\n• The Barrier Collapse (Suite A) rules\n• The Parity Inversion (Suite B) rules\n• Why missing demos cause wrong predictions\n• What the minimal demo set is",
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const { keywords, answer } of KNOWLEDGE) {
    if (keywords.some((k) => lower.includes(k))) return answer;
  }
  return "Hmm, I'm not sure about that specific question. Try asking about coverage, extrapolation, BDH-CQ, the Barrier suite, or the Parity suite. Or type 'help' to see what I know!";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! 👋 Ask me anything about coverage, extrapolation, or BDH-CQ. Try: 'What is coverage?' or 'Explain Suite A'" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: findAnswer(text) }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const QUICK_QUESTIONS = [
    "What is coverage?",
    "Explain Suite A",
    "How does BDH-CQ work?",
    "Why do wrong rules form?",
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600
                       text-white shadow-lg shadow-teal-500/30 flex items-center justify-center
                       hover:shadow-xl hover:shadow-teal-500/40 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden
                       bg-white border border-stone-200 shadow-2xl shadow-stone-900/10 flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">Coverage Q&A</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-br-md'
                        : 'bg-white border border-stone-200 text-stone-700 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-100">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60
                                 hover:bg-teal-100 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-stone-100">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about coverage, BDH-CQ..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm
                             placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
