// ============================================
// Risk Visualization Component
// Shows health risks as visual cards/meters
// ============================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HEALTH_RISKS } from '../../data/healthRisks';
import { HealthRiskType } from '../../types';
import { Info, TrendingDown, Shield, ChevronRight } from 'lucide-react';

interface RiskCardProps {
  riskType: HealthRiskType;
  currentRisk: number;
  baseRisk: number;
  reduction: number;
  compact?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const RiskCard = ({
  riskType,
  currentRisk,
  baseRisk,
  reduction,
  compact = false,
  onSelect,
  isSelected = false,
}: RiskCardProps) => {
  const risk = HEALTH_RISKS[riskType];
  
  // Risk level color coding
  const getRiskColor = (value: number) => {
    if (value <= 15) return '#22C55E'; // Green - low risk
    if (value <= 30) return '#84CC16'; // Lime - moderate-low
    if (value <= 45) return '#FFB800'; // Yellow - moderate
    if (value <= 60) return '#F97316'; // Orange - moderate-high
    return '#EF4444'; // Red - high risk
  };

  const riskColor = getRiskColor(currentRisk);
  const hasReduction = reduction > 0;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/risiko/${riskType}`);
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`
          p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm cursor-pointer
          border-2 transition-all
          ${isSelected ? 'border-[#00A39D]' : 'border-transparent hover:border-gray-200'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">{risk.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{risk.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentRisk}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: riskColor }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: riskColor }}>
                {Math.round(currentRisk)}%
              </span>
            </div>
          </div>
          {hasReduction && (
            <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
              <TrendingDown className="w-3 h-3" />
              -{Math.round(reduction)}%
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`
        p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm cursor-pointer
        border-2 transition-all
        ${isSelected ? 'border-[#00A39D] shadow-lg' : 'border-transparent hover:border-gray-200'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${risk.color}20` }}
          >
            {risk.icon}
          </div>
          <div>
            <h3 className="font-semibold">{risk.name}</h3>
            <p className="text-xs text-gray-500">{risk.description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Risk Meter */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Aktuelles Risiko</span>
          <span className="font-bold" style={{ color: riskColor }}>
            {Math.round(currentRisk)}%
          </span>
        </div>
        <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Base risk indicator */}
          <div 
            className="absolute top-0 bottom-0 border-r-2 border-gray-400 border-dashed"
            style={{ left: `${baseRisk}%` }}
          />
          {/* Current risk bar */}
          <motion.div
            initial={{ width: `${baseRisk}%` }}
            animate={{ width: `${currentRisk}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: riskColor }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Niedrig</span>
          <span>Hoch</span>
        </div>
      </div>

      {/* Reduction Stats */}
      {hasReduction && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Durch Vorsorge reduziert
            </span>
          </div>
          <span className="font-bold text-green-600 dark:text-green-400">
            -{Math.round(reduction)}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

interface RiskOverviewProps {
  risks: Record<HealthRiskType, { currentRisk: number; baseRisk: number; reduction: number }>;
  selectedRisk?: HealthRiskType | null;
  onSelectRisk?: (risk: HealthRiskType) => void;
  compact?: boolean;
}

export const RiskOverview = ({
  risks,
  selectedRisk,
  onSelectRisk,
  compact = false,
}: RiskOverviewProps) => {
  // Calculate overall protection score
  const totalReduction = Object.values(risks).reduce((sum, r) => sum + r.reduction, 0);
  const avgReduction = totalReduction / Object.keys(risks).length;
  const protectionScore = Math.min(100, Math.round(avgReduction * 2.5));

  return (
    <div className="space-y-4">
      {/* Protection Score Header */}
      <div className="bg-gradient-to-r from-[#00A39D] to-[#008C87] rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">Dein Schutz-Score</p>
            <p className="text-3xl font-bold">{protectionScore}%</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
        </div>
        <p className="text-sm text-teal-100 mt-2">
          {protectionScore < 30 && 'Starte mit einfachen Aufgaben um dein Risiko zu senken!'}
          {protectionScore >= 30 && protectionScore < 60 && 'Guter Anfang! Bleib dran für mehr Schutz.'}
          {protectionScore >= 60 && protectionScore < 80 && 'Super! Du tust viel für deine Gesundheit.'}
          {protectionScore >= 80 && 'Hervorragend! Du bist bestens geschützt! 🌟'}
        </p>
      </div>

      {/* Risk Cards Grid */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {(Object.keys(risks) as HealthRiskType[]).map((riskType) => (
          <RiskCard
            key={riskType}
            riskType={riskType}
            currentRisk={risks[riskType].currentRisk}
            baseRisk={risks[riskType].baseRisk}
            reduction={risks[riskType].reduction}
            compact={compact}
            isSelected={selectedRisk === riskType}
            onSelect={() => onSelectRisk?.(riskType)}
          />
        ))}
      </div>
    </div>
  );
};

export default RiskOverview;
