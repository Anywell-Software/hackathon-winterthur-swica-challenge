// ============================================
// Risk Detail Screen
// Shows detailed risk info and related tasks
// ============================================

import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  TrendingDown,
  CheckCircle,
  Clock,
  Star,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { HEALTH_RISKS, TASK_RISK_REDUCTIONS, calculateUserRiskProfile } from '../data/healthRisks';
import { CATEGORY_META, type HealthRiskType, type TaskTemplate } from '../types';

// Get tasks that reduce a specific risk
function getTasksForRisk(riskType: HealthRiskType): { taskId: string; reductionPercent: number; explanation: string }[] {
  const tasks: { taskId: string; reductionPercent: number; explanation: string }[] = [];
  
  Object.entries(TASK_RISK_REDUCTIONS).forEach(([taskId, reductions]) => {
    const reduction = reductions.find(r => r.riskType === riskType);
    if (reduction) {
      tasks.push({
        taskId,
        reductionPercent: reduction.reductionPercent,
        explanation: reduction.explanation,
      });
    }
  });
  
  // Sort by reduction percent descending
  return tasks.sort((a, b) => b.reductionPercent - a.reductionPercent);
}

// Risk level color coding
const getRiskColor = (value: number) => {
  if (value <= 15) return '#22C55E'; // Green - low risk
  if (value <= 30) return '#84CC16'; // Lime - moderate-low
  if (value <= 45) return '#FFB800'; // Yellow - moderate
  if (value <= 60) return '#F97316'; // Orange - moderate-high
  return '#EF4444'; // Red - high risk
};

const getRiskLevel = (value: number) => {
  if (value <= 15) return 'Niedrig';
  if (value <= 30) return 'Mässig';
  if (value <= 45) return 'Mittel';
  if (value <= 60) return 'Erhöht';
  return 'Hoch';
};

export default function RiskDetailScreen() {
  const { riskId } = useParams<{ riskId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { taskInstances, getTaskById } = useTaskStore();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [riskId]);

  // Get the risk data
  const risk = riskId ? HEALTH_RISKS[riskId as HealthRiskType] : null;

  // Calculate user's risk profile
  const riskProfile = useMemo(() => {
    const completedTaskIds = taskInstances
      .filter(t => t.status === 'completed_today' || t.completionHistory.length > 0)
      .map(t => t.taskId);
    return calculateUserRiskProfile(completedTaskIds);
  }, [taskInstances]);

  // Get tasks that help with this risk
  const relatedTasks = useMemo(() => {
    if (!riskId) return [];
    return getTasksForRisk(riskId as HealthRiskType);
  }, [riskId]);

  // Get task templates for the related tasks
  const taskTemplates = useMemo(() => {
    const templates: Map<string, TaskTemplate> = new Map();
    relatedTasks.forEach(t => {
      const template = getTaskById(t.taskId);
      if (template) {
        templates.set(t.taskId, template);
      }
    });
    return templates;
  }, [relatedTasks, getTaskById]);

  // Check which tasks are already active for the user
  const userTaskIds = useMemo(() => {
    return new Set(taskInstances.map(t => t.taskId));
  }, [taskInstances]);

  if (!risk || !riskId || !currentUser) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Risiko nicht gefunden</p>
        </div>
      </div>
    );
  }

  const userRisk = riskProfile[riskId as HealthRiskType];
  const riskColor = getRiskColor(userRisk.currentRisk);
  const riskLevel = getRiskLevel(userRisk.currentRisk);

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
          <span className="text-sm text-gray-500">Gesundheitsrisiko</span>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div
          className="h-32 flex items-center justify-center relative"
          style={{ backgroundColor: `${risk.color}20` }}
        >
          <span className="text-7xl">{risk.icon}</span>
          {userRisk.reduction > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              Geschützt
            </motion.div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{risk.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{risk.description}</p>

          {/* Risk Meter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Dein aktuelles Risiko</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: riskColor }}>
                  {Math.round(userRisk.currentRisk)}%
                </span>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
                >
                  {riskLevel}
                </span>
              </div>
            </div>
            <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              {/* Base risk indicator */}
              <div 
                className="absolute top-0 bottom-0 border-r-2 border-gray-400 border-dashed z-10"
                style={{ left: `${userRisk.baseRisk}%` }}
                title={`Grundrisiko: ${userRisk.baseRisk}%`}
              />
              {/* Current risk bar */}
              <motion.div
                initial={{ width: `${userRisk.baseRisk}%` }}
                animate={{ width: `${userRisk.currentRisk}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: riskColor }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span className="text-gray-500">
                Grundrisiko: {userRisk.baseRisk}%
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Reduction Stats */}
          {userRisk.reduction > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Durch deine Vorsorge reduziert
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Du hast dein Risiko aktiv gesenkt!
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                -{Math.round(userRisk.reduction)}%
              </span>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-[#00A39D]" />
            Was du wissen solltest
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Das angezeigte Risiko basiert auf durchschnittlichen Bevölkerungsdaten und deinem 
              Präventionsverhalten. Es ist keine medizinische Diagnose. Bei konkreten Beschwerden 
              wende dich bitte an einen Arzt.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#00A39D] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Regelmässige Vorsorge und ein gesunder Lebensstil können das Risiko für {risk.name.toLowerCase()} 
              deutlich senken. Jede abgeschlossene Aufgabe trägt zu deinem Schutz bei.
            </p>
          </div>
        </div>
      </Card>

      {/* Related Tasks */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#00A39D]" />
            Aufgaben die helfen
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Diese Aufgaben können dein Risiko für {risk.name} reduzieren
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {relatedTasks.map((task, index) => {
            const template = taskTemplates.get(task.taskId);
            if (!template) return null;

            const isActive = userTaskIds.has(task.taskId);
            const categoryMeta = CATEGORY_META[template.category];

            return (
              <motion.div
                key={task.taskId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  // Find the instance ID for this task
                  const instance = taskInstances.find(t => t.taskId === task.taskId);
                  if (instance) {
                    navigate(`/aufgaben/${instance.id}`);
                  } else {
                    navigate('/aufgaben');
                  }
                }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${categoryMeta.color}20` }}
                  >
                    {template.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{template.title}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-medium">
                          Aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {task.explanation}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {template.points} Pkt
                      </span>
                      <Badge category={template.category} size="sm" />
                    </div>
                  </div>

                  {/* Reduction */}
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-green-500">
                      -{task.reductionPercent}%
                    </span>
                    <span className="text-xs text-gray-400">Risiko</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Call to Action */}
      {relatedTasks.length > 0 && (
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/aufgaben')} 
            className="flex-1" 
            size="lg"
          >
            Alle Aufgaben anzeigen
          </Button>
        </div>
      )}
    </div>
  );
}
