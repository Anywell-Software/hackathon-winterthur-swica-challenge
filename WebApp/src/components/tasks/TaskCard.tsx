// ============================================
// TaskCard Component
// ============================================

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, Check, CalendarPlus } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { UserTaskInstance, TaskTemplate, CATEGORY_META } from '../../types';
import { getTaskStatus, getDaysUntilDue } from '../../services/calculators';
import { Badge, PriorityBadge } from '../ui';

interface TaskCardProps {
  instance: UserTaskInstance;
  template: TaskTemplate;
  onComplete?: () => void;
  onAddToCalendar?: () => void;
  compact?: boolean;
}

export const TaskCard = memo(({
  instance,
  template,
  onComplete,
  onAddToCalendar,
  compact = false,
}: TaskCardProps) => {
  const navigate = useNavigate();
  const status = getTaskStatus(instance);
  const daysUntil = getDaysUntilDue(instance.nextDue);
  const categoryMeta = CATEGORY_META[template.category];

  const isCompleted = status === 'completed_today';
  const isOverdue = status === 'overdue';

  const getDueDateText = () => {
    if (isCompleted) return 'Heute erledigt ✓';
    if (daysUntil < 0) return `${Math.abs(daysUntil)} Tage überfällig`;
    if (daysUntil === 0) return 'Heute fällig';
    if (daysUntil === 1) return 'Morgen';
    if (daysUntil <= 7) return `In ${daysUntil} Tagen`;
    return format(new Date(instance.nextDue), 'dd.MM.yyyy', { locale: de });
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          flex items-center gap-3 p-3 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          ${isCompleted ? 'opacity-60' : ''}
          ${isOverdue ? 'border-red-300 dark:border-red-800' : ''}
        `}
      >
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 
            flex items-center justify-center transition-all
            ${isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-[#00A39D]'
            }
          `}
        >
          {isCompleted && <Check className="w-4 h-4" />}
        </button>

        <Link to={`/aufgaben/${instance.id}`} className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {categoryMeta.icon} {template.title}
          </p>
        </Link>

        <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
          {getDueDateText()}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`
        bg-white dark:bg-gray-800
        rounded-2xl border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${isCompleted ? 'opacity-70' : ''}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Clickable area - navigates to detail view */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => navigate(`/aufgaben/${instance.id}`)}
      >
        <div className="flex items-start gap-3">
          {/* Completion button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.();
            }}
            disabled={isCompleted}
            className={`
              flex-shrink-0 w-10 h-10 rounded-xl
              flex items-center justify-center text-xl
              transition-all
              ${isCompleted
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-gray-100 dark:bg-gray-700 hover:scale-110'
              }
            `}
            style={{
              backgroundColor: isCompleted ? undefined : `${categoryMeta.color}20`,
            }}
          >
            {isCompleted ? '✓' : categoryMeta.icon}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-semibold hover:text-[#00A39D] transition-colors ${isCompleted ? 'line-through text-gray-400' : ''}`}
              >
                {template.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {template.duration}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                  {getDueDateText()}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge category={template.category} size="sm" />
              <PriorityBadge priority={template.priority} />
              <Badge size="sm">⭐ {template.points} Pkt</Badge>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex flex-col gap-1">
            <div className="p-2">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {!isCompleted && (
        <div className="flex border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onComplete}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <Check className="w-4 h-4" />
            Erledigt
          </button>
          <div className="w-px bg-gray-100 dark:bg-gray-700" />
          <button
            onClick={onAddToCalendar}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#00A39D] hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            Zum Kalender
          </button>
        </div>
      )}
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
