// ============================================
// Task Completion Modal with Confetti
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Star, Flame, Trophy } from 'lucide-react';
import { Modal, Button, AnimatedNumber } from '../ui';
import { TaskTemplate } from '../../types';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskTemplate | null;
  pointsEarned: number;
  bonusPoints: number;
  newStreak: number;
  newAchievements?: string[];
}

export const TaskCompletionModal = ({
  isOpen,
  onClose,
  task,
  pointsEarned,
  bonusPoints,
  newStreak,
  newAchievements = [],
}: TaskCompletionModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && !showConfetti) {
      setShowConfetti(true);
      
      // Fire confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#00A39D', '#22c55e', '#FFB800', '#8b5cf6', '#ec4899'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-4">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          Geschafft! 🎉
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          {task.title} abgeschlossen
        </motion.p>

        {/* Points earned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="w-5 h-5" />
            <span className="text-lg font-bold">
              +<AnimatedNumber value={pointsEarned} /> Punkte
            </span>
          </div>
          {bonusPoints > 0 && (
            <p className="text-sm opacity-90">
              inkl. {bonusPoints} Bonus-Punkte!
            </p>
          )}
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-orange-500 mb-6"
        >
          <Flame className="w-5 h-5" />
          <span className="font-semibold">{newStreak} Tage Streak!</span>
        </motion.div>

        {/* New achievements */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Neues Achievement!</span>
            </div>
            {newAchievements.map((achievement) => (
              <p key={achievement} className="text-sm">
                {achievement}
              </p>
            ))}
          </motion.div>
        )}

        {/* Close button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button onClick={onClose} className="w-full">
            Weiter
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default TaskCompletionModal;
