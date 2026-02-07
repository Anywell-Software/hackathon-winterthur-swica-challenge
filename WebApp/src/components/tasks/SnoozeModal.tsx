// ============================================
// Task Snooze Modal
// ============================================

import { Clock, Sun, Calendar } from 'lucide-react';
import { Modal, Button } from '../ui';

interface SnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (duration: '1h' | '3h' | 'tomorrow') => void;
  taskTitle?: string;
}

export const SnoozeModal = ({
  isOpen,
  onClose,
  onSnooze,
  taskTitle,
}: SnoozeModalProps) => {
  const handleSnooze = (duration: '1h' | '3h' | 'tomorrow') => {
    onSnooze(duration);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Später erinnern" size="sm">
      <div className="space-y-3">
        {taskTitle && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Wann möchten Sie an "{taskTitle}" erinnert werden?
          </p>
        )}

        <button
          onClick={() => handleSnooze('1h')}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">In 1 Stunde</p>
            <p className="text-sm text-gray-500">Kurze Pause</p>
          </div>
        </button>

        <button
          onClick={() => handleSnooze('3h')}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Sun className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="font-medium">In 3 Stunden</p>
            <p className="text-sm text-gray-500">Später heute</p>
          </div>
        </button>

        <button
          onClick={() => handleSnooze('tomorrow')}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium">Morgen</p>
            <p className="text-sm text-gray-500">Am nächsten Tag</p>
          </div>
        </button>

        <div className="pt-2">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Abbrechen
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SnoozeModal;
