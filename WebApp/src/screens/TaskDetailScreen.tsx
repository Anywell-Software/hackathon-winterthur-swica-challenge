// ============================================
// Task Detail Screen
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  ExternalLink,
  Check,
  Bell,
  Heart,
  Brain,
  Dumbbell,
  Users,
  Wallet,
  Apple,
  Flame,
  History,
  Info,
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing, RiskReductionAnimation, Timer } from '../components/ui';
import { TaskCompletionModal, CalendarExportModal } from '../components/tasks';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { TASK_RISK_REDUCTIONS } from '../data/healthRisks';
import { CATEGORY_META, type TaskCategory, type RiskReduction } from '../types';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

const categoryIcons: Record<TaskCategory, React.ReactNode> = {
  medical: <Heart className="w-6 h-6" />,
  mental_health: <Brain className="w-6 h-6" />,
  fitness: <Dumbbell className="w-6 h-6" />,
  social: <Users className="w-6 h-6" />,
  financial: <Wallet className="w-6 h-6" />,
  nutrition: <Apple className="w-6 h-6" />,
};

// Tasks that benefit from a timer
const TIMER_TASK_IDS = [
  'daily-meditation',
  'daily-breathing',
  'daily-exercise',
  'daily-stretching',
  'weekly-yoga',
  'weekly-strength',
  'daily-walk',
  'daily-nature',
];

const isTimerTask = (taskId: string): boolean => {
  return TIMER_TASK_IDS.includes(taskId) ||
    taskId.includes('meditation') ||
    taskId.includes('breathing') ||
    taskId.includes('exercise') ||
    taskId.includes('yoga') ||
    taskId.includes('stretching');
};

const parseDefaultMinutes = (duration: string): number => {
  // Parse duration strings like "10-20min", "5min", "30min"
  const match = duration.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 5; // Default to 5 minutes
};

export default function TaskDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { taskInstances, completeTask, getTaskById, getInstanceById } = useTaskStore();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRiskAnimation, setShowRiskAnimation] = useState(false);
  const [currentRiskReductions, setCurrentRiskReductions] = useState<RiskReduction[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Get task instance and template
  const instance = useMemo(() => getInstanceById(id || ''), [id, getInstanceById]);
  const template = useMemo(() => {
    if (!instance) return null;
    return getTaskById(instance.taskId);
  }, [instance, getTaskById]);

  if (!instance || !template || !currentUser) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Aufgabe nicht gefunden</p>
        </div>
      </div>
    );
  }

  const meta = CATEGORY_META[template.category];
  const dueDate = new Date(instance.nextDue);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);
  const daysUntil = differenceInDays(dueDate, new Date());
  const isCompletedToday = instance.status === 'completed_today';

  const handleComplete = async () => {
    try {
      const result = await completeTask(instance.id);
      setEarnedPoints(result.points);
      setBonusPoints(result.bonusPoints);

      // Check for risk reductions
      const taskRiskReductions = TASK_RISK_REDUCTIONS[template.id];
      if (taskRiskReductions && taskRiskReductions.length > 0) {
        setCurrentRiskReductions(taskRiskReductions);
        setShowRiskAnimation(true);
      } else {
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const closeRiskAnimation = () => {
    setShowRiskAnimation(false);
    setEarnedPoints(0);
    setBonusPoints(0);
    navigate(-1); // Go back to previous page
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setEarnedPoints(0);
    setBonusPoints(0);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück</span>
        </Button>
        <div className="flex-1">
          <Badge category={template.category} />
        </div>
      </div>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div
          className="h-24 flex items-center justify-center"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          <span className="text-6xl">{template.icon}</span>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{template.description}</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{template.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {isCompletedToday
                  ? 'Heute erledigt ✓'
                  : isOverdue
                    ? `${Math.abs(daysUntil)} Tage überfällig`
                    : daysUntil === 0
                      ? 'Heute fällig'
                      : `In ${daysUntil} Tagen`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{template.points} Punkte</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{instance.streakCount} Streak</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {!isCompletedToday && (
        <div className="flex gap-4">
          <Button onClick={handleComplete} className="flex-1" size="lg">
            <Check className="w-5 h-5 mr-2" />
            Als erledigt markieren
          </Button>
          <Button variant="outline" onClick={() => setShowCalendarModal(true)} size="lg">
            <Calendar className="w-5 h-5 mr-2" />
            Zum Kalender
          </Button>
        </div>
      )}

      {/* Timer for meditation, breathing, and exercise tasks */}
      {isTimerTask(template.id) && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00A39D]" />
              Timer starten
            </h2>
          </div>
          <div className="p-6">
            <Timer
              defaultMinutes={parseDefaultMinutes(template.duration)}
              taskTitle={template.title}
            />
          </div>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-[#00A39D]" />
            Warum ist das wichtig?
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {template.researchBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                ✓
              </span>
              <p className="text-sm">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* How to Complete */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold">So geht&apos;s</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400">{template.howToComplete}</p>
        </div>
      </Card>

      {/* Tips */}
      {template.tips.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold">💡 Tipps</h2>
          </div>
          <div className="p-4 space-y-2">
            {template.tips.map((tip, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                • {tip}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* External Links */}
      {template.externalLinks.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold">Weitere Informationen</h2>
          </div>
          <div className="p-4 space-y-2">
            {template.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#00A39D] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {link.title}
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Completion History */}
      {instance.completionHistory.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              Letzte Erledigungen
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {instance.completionHistory.slice(0, 5).map((completion, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {format(new Date(completion.completedAt), 'dd.MM.yyyy HH:mm', { locale: de })}
                </span>
                <span className="text-yellow-500 font-medium">
                  +{completion.pointsEarned} Punkte
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modals */}
      <RiskReductionAnimation
        isOpen={showRiskAnimation}
        onClose={closeRiskAnimation}
        reductions={currentRiskReductions}
        taskTitle={template.title}
        taskIcon={template.icon}
        earnedPoints={earnedPoints}
        bonusPoints={bonusPoints}
      />

      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={closeCompletionModal}
        task={template}
        pointsEarned={earnedPoints}
        bonusPoints={bonusPoints}
        newStreak={currentUser.currentStreak}
        newAchievements={[]}
      />

      <CalendarExportModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        taskTitle={template.title}
        taskDescription={template.description}
        dueDate={instance.nextDue}
        duration={template.duration}
      />
    </div>
  );
}
