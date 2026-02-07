// ============================================
// Health Risk Definitions and Data
// ============================================

import { HealthRisk, HealthRiskType } from '../types';

export const HEALTH_RISKS: Record<HealthRiskType, HealthRisk> = {
  heart_disease: {
    id: 'heart_disease',
    name: 'Herzerkrankungen',
    icon: '❤️',
    color: '#EF4444',
    baseRisk: 45,
    description: 'Koronare Herzkrankheit, Herzinfarkt, Herzinsuffizienz',
  },
  stroke: {
    id: 'stroke',
    name: 'Schlaganfall',
    icon: '🧠',
    color: '#8B5CF6',
    baseRisk: 35,
    description: 'Hirninfarkt durch Durchblutungsstörung oder Blutung',
  },
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes Typ 2',
    icon: '🩸',
    color: '#F59E0B',
    baseRisk: 40,
    description: 'Stoffwechselerkrankung mit erhöhtem Blutzucker',
  },
  cancer: {
    id: 'cancer',
    name: 'Krebs',
    icon: '🎗️',
    color: '#EC4899',
    baseRisk: 38,
    description: 'Verschiedene Krebsarten durch Vorsorge reduzierbar',
  },
  depression: {
    id: 'depression',
    name: 'Depression',
    icon: '😔',
    color: '#6366F1',
    baseRisk: 32,
    description: 'Psychische Erkrankung mit anhaltender Niedergeschlagenheit',
  },
  dementia: {
    id: 'dementia',
    name: 'Demenz',
    icon: '🧩',
    color: '#14B8A6',
    baseRisk: 28,
    description: 'Alzheimer und andere kognitive Einschränkungen',
  },
  osteoporosis: {
    id: 'osteoporosis',
    name: 'Osteoporose',
    icon: '🦴',
    color: '#78716C',
    baseRisk: 25,
    description: 'Knochenschwund mit erhöhtem Frakturrisiko',
  },
  obesity: {
    id: 'obesity',
    name: 'Adipositas',
    icon: '⚖️',
    color: '#F97316',
    baseRisk: 42,
    description: 'Starkes Übergewicht mit Folgeerkrankungen',
  },
};

// Risk reduction percentages based on scientific research
export const TASK_RISK_REDUCTIONS: Record<string, { riskType: HealthRiskType; reductionPercent: number; explanation: string }[]> = {
  'daily-exercise': [
    { riskType: 'heart_disease', reductionPercent: 3.5, explanation: 'Regelmässige Bewegung stärkt das Herz-Kreislauf-System' },
    { riskType: 'stroke', reductionPercent: 2.7, explanation: 'Bewegung verbessert die Durchblutung des Gehirns' },
    { riskType: 'diabetes', reductionPercent: 4.2, explanation: 'Sport verbessert die Insulinsensitivität' },
    { riskType: 'depression', reductionPercent: 3.0, explanation: 'Endorphine verbessern die Stimmung' },
    { riskType: 'obesity', reductionPercent: 5.0, explanation: 'Kalorienverbrennung hilft bei Gewichtskontrolle' },
  ],
  'daily-meditation': [
    { riskType: 'depression', reductionPercent: 4.5, explanation: 'Achtsamkeit reduziert Stress und Angst' },
    { riskType: 'heart_disease', reductionPercent: 2.0, explanation: 'Stressreduktion senkt den Blutdruck' },
    { riskType: 'dementia', reductionPercent: 1.8, explanation: 'Meditation fördert die Neuroplastizität' },
  ],
  'daily-water': [
    { riskType: 'diabetes', reductionPercent: 1.5, explanation: 'Gute Hydration unterstützt den Stoffwechsel' },
    { riskType: 'obesity', reductionPercent: 1.2, explanation: 'Wasser hilft bei Sättigung und Stoffwechsel' },
  ],
  'daily-sleep-tracking': [
    { riskType: 'heart_disease', reductionPercent: 2.8, explanation: 'Erholsamer Schlaf regeneriert das Herz' },
    { riskType: 'depression', reductionPercent: 3.5, explanation: 'Guter Schlaf stabilisiert die Psyche' },
    { riskType: 'dementia', reductionPercent: 2.2, explanation: 'Im Schlaf werden Giftstoffe aus dem Gehirn entfernt' },
    { riskType: 'obesity', reductionPercent: 2.0, explanation: 'Schlafmangel erhöht Hungerhormone' },
  ],
  'daily-gratitude': [
    { riskType: 'depression', reductionPercent: 3.2, explanation: 'Dankbarkeit fördert positive Gedanken' },
    { riskType: 'heart_disease', reductionPercent: 1.0, explanation: 'Positive Emotionen senken Stresshormone' },
  ],
  'daily-breathing': [
    { riskType: 'depression', reductionPercent: 2.5, explanation: 'Atemübungen aktivieren den Parasympathikus' },
    { riskType: 'heart_disease', reductionPercent: 1.5, explanation: 'Tiefe Atmung senkt den Blutdruck' },
  ],
  'daily-posture': [
    { riskType: 'osteoporosis', reductionPercent: 1.5, explanation: 'Gute Haltung stärkt die Wirbelsäule' },
  ],
  'daily-social': [
    { riskType: 'depression', reductionPercent: 4.0, explanation: 'Soziale Kontakte stärken das Wohlbefinden' },
    { riskType: 'dementia', reductionPercent: 2.5, explanation: 'Soziale Aktivität hält das Gehirn fit' },
    { riskType: 'heart_disease', reductionPercent: 1.5, explanation: 'Soziale Unterstützung reduziert Stress' },
  ],
  'weekly-strength': [
    { riskType: 'osteoporosis', reductionPercent: 4.5, explanation: 'Krafttraining stärkt die Knochen' },
    { riskType: 'diabetes', reductionPercent: 3.0, explanation: 'Muskeln verbessern den Zuckerstoffwechsel' },
    { riskType: 'obesity', reductionPercent: 3.5, explanation: 'Mehr Muskelmasse erhöht den Grundumsatz' },
  ],
  'weekly-social-meetup': [
    { riskType: 'depression', reductionPercent: 5.0, explanation: 'Regelmässige Treffen stärken die Psyche' },
    { riskType: 'dementia', reductionPercent: 3.0, explanation: 'Soziale Interaktion fördert kognitive Gesundheit' },
  ],
  'weekly-meal-prep': [
    { riskType: 'obesity', reductionPercent: 3.5, explanation: 'Geplante Mahlzeiten reduzieren Fastfood' },
    { riskType: 'diabetes', reductionPercent: 2.5, explanation: 'Gesunde Zubereitung kontrolliert Zucker' },
    { riskType: 'heart_disease', reductionPercent: 2.0, explanation: 'Weniger Salz und ungesunde Fette' },
  ],
  'weekly-nature': [
    { riskType: 'depression', reductionPercent: 3.5, explanation: 'Natur reduziert Stress nachweislich' },
    { riskType: 'heart_disease', reductionPercent: 1.5, explanation: 'Frische Luft und Bewegung' },
  ],
  'weekly-stretching': [
    { riskType: 'osteoporosis', reductionPercent: 1.5, explanation: 'Flexibilität unterstützt Knochengesundheit' },
  ],
  'weekly-cooking': [
    { riskType: 'obesity', reductionPercent: 2.5, explanation: 'Selbst kochen = weniger Kalorien' },
    { riskType: 'heart_disease', reductionPercent: 2.0, explanation: 'Kontrolle über Zutaten' },
  ],
  'monthly-weight': [
    { riskType: 'obesity', reductionPercent: 2.0, explanation: 'Bewusstsein hilft bei der Gewichtskontrolle' },
    { riskType: 'diabetes', reductionPercent: 1.5, explanation: 'Frühzeitige Erkennung von Gewichtszunahme' },
  ],
  'annual-checkup': [
    { riskType: 'heart_disease', reductionPercent: 5.0, explanation: 'Früherkennung von Risikofaktoren' },
    { riskType: 'cancer', reductionPercent: 4.0, explanation: 'Regelmässige Vorsorgeuntersuchungen' },
    { riskType: 'diabetes', reductionPercent: 4.5, explanation: 'Blutzuckerkontrolle ermöglicht frühe Intervention' },
  ],
  'annual-dental': [
    { riskType: 'heart_disease', reductionPercent: 1.5, explanation: 'Zahngesundheit beeinflusst Herzgesundheit' },
  ],
  'annual-eye': [
    { riskType: 'diabetes', reductionPercent: 1.0, explanation: 'Diabetische Retinopathie früh erkennen' },
  ],
  'mammography': [
    { riskType: 'cancer', reductionPercent: 6.0, explanation: 'Brustkrebs-Früherkennung rettet Leben' },
  ],
  'colonoscopy': [
    { riskType: 'cancer', reductionPercent: 7.0, explanation: 'Darmkrebs-Früherkennung und Prävention' },
  ],
  'skin-check': [
    { riskType: 'cancer', reductionPercent: 4.0, explanation: 'Hautkrebs ist früh erkannt gut behandelbar' },
  ],
  'blood-pressure': [
    { riskType: 'heart_disease', reductionPercent: 3.0, explanation: 'Blutdruckkontrolle schützt das Herz' },
    { riskType: 'stroke', reductionPercent: 4.0, explanation: 'Hoher Blutdruck ist Hauptrisikofaktor' },
  ],
  'cholesterol': [
    { riskType: 'heart_disease', reductionPercent: 4.0, explanation: 'Cholesterinkontrolle beugt Arteriosklerose vor' },
    { riskType: 'stroke', reductionPercent: 3.0, explanation: 'Weniger Ablagerungen in Gefässen' },
  ],
};

// Calculate total risk reduction for a user based on completed tasks
export function calculateUserRiskProfile(
  completedTaskIds: string[],
  baseRisks: Record<HealthRiskType, number> = {} as Record<HealthRiskType, number>
): Record<HealthRiskType, { currentRisk: number; reduction: number; baseRisk: number }> {
  const profile: Record<HealthRiskType, { currentRisk: number; reduction: number; baseRisk: number }> = {} as any;

  // Initialize with base risks
  Object.keys(HEALTH_RISKS).forEach((riskId) => {
    const risk = HEALTH_RISKS[riskId as HealthRiskType];
    const base = baseRisks[riskId as HealthRiskType] ?? risk.baseRisk;
    profile[riskId as HealthRiskType] = {
      baseRisk: base,
      reduction: 0,
      currentRisk: base,
    };
  });

  // Apply reductions from completed tasks
  completedTaskIds.forEach((taskId) => {
    const reductions = TASK_RISK_REDUCTIONS[taskId];
    if (reductions) {
      reductions.forEach(({ riskType, reductionPercent }) => {
        profile[riskType].reduction += reductionPercent;
      });
    }
  });

  // Calculate current risk (with minimum of 5%)
  Object.keys(profile).forEach((riskId) => {
    const riskProfile = profile[riskId as HealthRiskType];
    riskProfile.currentRisk = Math.max(5, riskProfile.baseRisk - riskProfile.reduction);
  });

  return profile;
}
