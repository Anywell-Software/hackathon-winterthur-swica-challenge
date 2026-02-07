// ============================================
// Risk Reduction Animation Component
// Dramatic visualization when a task reduces health risk
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { HEALTH_RISKS } from '../../data/healthRisks';
import { RiskReduction } from '../../types';
import { TrendingDown, Shield } from 'lucide-react';

interface RiskReductionAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  reductions: RiskReduction[];
  taskTitle: string;
  taskIcon: string;
  earnedPoints?: number;
  bonusPoints?: number;
}

export const RiskReductionAnimation = ({
  isOpen,
  onClose,
  reductions,
  taskTitle,
  taskIcon,
  earnedPoints = 0,
  bonusPoints = 0,
}: RiskReductionAnimationProps) => {
  // Animation phases: graph -> summary (simplified)
  const [phase, setPhase] = useState<'graph' | 'summary'>('graph');
  const [graphProgress, setGraphProgress] = useState(0);
  const [showPercentage, setShowPercentage] = useState(false);

  // Sort reductions by percentage (biggest first)
  const sortedReductions = useMemo(() => {
    return [...reductions].sort((a, b) => b.reductionPercent - a.reductionPercent);
  }, [reductions]);

  const biggestReduction = sortedReductions[0];
  const otherReductions = sortedReductions.slice(1);
  const biggestRisk = biggestReduction ? HEALTH_RISKS[biggestReduction.riskType] : null;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPhase('graph');
      setGraphProgress(0);
      setShowPercentage(false);
      return;
    }

    // Phase 1: Animate the graph line falling
    const graphTimer = setTimeout(() => {
      setGraphProgress(1);
    }, 300);

    // Phase 2: Show percentage after graph animation, then immediately show summary
    const percentageTimer = setTimeout(() => {
      setShowPercentage(true);
      setPhase('summary');
    }, 1800);

    return () => {
      clearTimeout(graphTimer);
      clearTimeout(percentageTimer);
    };
  }, [isOpen]);

  if (!isOpen || !biggestReduction || !biggestRisk) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={phase === 'summary' ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Task header - small */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
              {taskIcon}
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">Erledigt</p>
              <p className="text-white font-semibold">{taskTitle}</p>
            </div>
          </motion.div>

          {/* Main Graph Area */}
          <div className="relative h-48 mb-6">
            {/* Risk name label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 left-0 flex items-center gap-2"
            >
              <span className="text-2xl">{biggestRisk.icon}</span>
              <span className="text-white/80 font-medium">{biggestRisk.name}</span>
            </motion.div>

            {/* The Graph */}
            <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
              {/* Grid lines */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.1 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={30 + i * 35}
                    x2="380"
                    y2={30 + i * 35}
                    stroke="white"
                    strokeWidth="1"
                  />
                ))}
              </motion.g>

              {/* Y-axis labels */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 }}
                className="text-xs"
              >
                <text x="40" y="35" fill="white" textAnchor="end" fontSize="10">100%</text>
                <text x="40" y="105" fill="white" textAnchor="end" fontSize="10">50%</text>
                <text x="40" y="170" fill="white" textAnchor="end" fontSize="10">0%</text>
              </motion.g>

              {/* The falling line path */}
              <motion.path
                d={`M 60 ${65} 
                    L 150 ${65} 
                    C 180 ${65}, 200 ${65 + biggestReduction.reductionPercent * 8}, 220 ${65 + biggestReduction.reductionPercent * 8}
                    L 370 ${65 + biggestReduction.reductionPercent * 8}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: graphProgress }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={biggestRisk.color} />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>

              {/* Start point */}
              <motion.circle
                cx="60"
                cy="65"
                r="6"
                fill={biggestRisk.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />

              {/* End point (appears after line animation) */}
              <motion.circle
                cx="370"
                cy={65 + biggestReduction.reductionPercent * 8}
                r="8"
                fill="#22C55E"
                initial={{ scale: 0 }}
                animate={{ scale: graphProgress }}
                transition={{ delay: 1.0, type: 'spring' }}
              />

              {/* Glow effect on end point */}
              <motion.circle
                cx="370"
                cy={65 + biggestReduction.reductionPercent * 8}
                r="16"
                fill="#22C55E"
                opacity={0.3}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 0.5, 0.3] }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </svg>

            {/* Percentage Reveal */}
            <AnimatePresence>
              {showPercentage && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute bottom-4 right-4 bg-green-500 rounded-2xl px-5 py-3 shadow-lg shadow-green-500/30"
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-white" />
                    <span className="text-3xl font-bold text-white">
                      -{biggestReduction.reductionPercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-white/80 text-xs mt-1">{biggestReduction.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Reductions - show all at once */}
          {otherReductions.length > 0 && phase === 'summary' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-white/50 text-xs uppercase tracking-wide mb-3">
                Weitere Risiken reduziert
              </p>
              <div className="grid grid-cols-2 gap-2">
                {otherReductions.map((reduction, index) => {
                  const risk = HEALTH_RISKS[reduction.riskType];
                  return (
                    <motion.div
                      key={reduction.riskType}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15, delay: index * 0.05 }}
                      className="bg-white/10 rounded-xl p-3 flex items-center gap-2"
                    >
                      <span className="text-xl">{risk.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{risk.name}</p>
                        <p className="text-green-400 text-xs font-bold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          -{reduction.reductionPercent.toFixed(1)}%
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {phase === 'summary' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Points earned */}
              {(earnedPoints > 0 || bonusPoints > 0) && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-4 mb-4"
                >
                  <div className="flex items-center gap-2 bg-[#FFB800]/20 px-4 py-2 rounded-xl">
                    <span className="text-xl">⭐</span>
                    <span className="text-xl font-bold text-[#FFB800]">+{earnedPoints}</span>
                  </div>
                  {bonusPoints > 0 && (
                    <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl">
                      <span className="text-xl">🎁</span>
                      <span className="text-xl font-bold text-purple-400">+{bonusPoints}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Health impact summary card */}
              <div className="bg-gradient-to-r from-[#00A39D] to-[#008C87] rounded-2xl p-4 text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-white/80" />
                  <span className="text-white/80 text-sm">Gesundheitsschutz verbessert</span>
                </div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl font-bold text-white"
                >
                  {reductions.length} {reductions.length === 1 ? 'Risiko' : 'Risiken'}
                </motion.p>
                <p className="text-teal-100 text-sm mt-1">
                  aktiv reduziert durch diese Aufgabe
                </p>
              </div>

              {/* Motivational message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-white/50 mb-4 text-sm"
              >
                🌟 Jede Aufgabe bringt dich näher zu einem gesünderen Leben!
              </motion.p>

              {/* Close button */}
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-[#FFB800] hover:bg-[#E5A600] text-black font-semibold rounded-xl transition-colors"
              >
                Weiter so! 💪
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RiskReductionAnimation;
