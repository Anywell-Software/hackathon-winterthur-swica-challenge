// ============================================
// Settings Screen
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Info,
  Heart,
} from 'lucide-react';
import { Card, Button, Modal } from '../components/ui';
import { useUIStore } from '../store/uiStore';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { useAchievementStore } from '../store/achievementStore';

export default function SettingsScreen() {
  const { theme, setTheme, addToast } = useUIStore();
  const { currentUser, updateUser } = useUserStore();
  const { taskInstances } = useTaskStore();
  const { getUnlockedAchievements } = useAchievementStore();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const unlockedAchievements = getUnlockedAchievements();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    addToast({
      type: 'success',
      title: 'Design geändert',
      message: `Design wurde auf ${
        newTheme === 'light' ? 'Hell' : newTheme === 'dark' ? 'Dunkel' : 'System'
      } geändert`,
    });
  };

  const handleExportData = () => {
    const data = {
      user: currentUser,
      tasks: taskInstances,
      achievements: unlockedAchievements,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vorsorge-guide-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Export erfolgreich',
      message: 'Deine Daten wurden exportiert',
    });
  };

  const handleResetData = () => {
    // Clear localStorage
    localStorage.clear();
    // Reload app
    window.location.reload();
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Bitte anmelden...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Passe die App an deine Bedürfnisse an
        </p>
      </div>

      {/* Profile */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[#00A39D]" />
            Profil
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00A39D] flex items-center justify-center text-white text-xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">
                {currentUser.age} Jahre • {currentUser.gender === 'male' ? 'Männlich' : currentUser.gender === 'female' ? 'Weiblich' : 'Divers'}
              </p>
              <p className="text-sm text-[#00A39D]">
                Level {Math.floor(currentUser.totalPoints / 1000) + 1} • {currentUser.totalPoints} Punkte
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#00A39D]" />
            Erscheinungsbild
          </h2>
        </div>
        <div className="p-4">
          <div className="flex gap-4">
            {([
              { id: 'light', label: 'Hell', icon: Sun },
              { id: 'dark', label: 'Dunkel', icon: Moon },
              { id: 'system', label: 'System', icon: Globe },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleThemeChange(id)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  theme === id
                    ? 'border-[#00A39D] bg-[#00A39D]/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${theme === id ? 'text-[#00A39D]' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${theme === id ? 'text-[#00A39D]' : ''}`}>
                  {label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00A39D]" />
            Benachrichtigungen
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push-Benachrichtigungen</p>
              <p className="text-sm text-gray-500">Erhalte Erinnerungen für fällige Aufgaben</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentUser.preferences.notificationsEnabled}
                onChange={(e) =>
                  updateUser({
                    preferences: {
                      ...currentUser.preferences,
                      notificationsEnabled: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00A39D]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Erinnerungszeit</p>
              <p className="text-sm text-gray-500">Wann möchtest du erinnert werden?</p>
            </div>
            <input
              type="time"
              value={currentUser.preferences.reminderTime}
              onChange={(e) =>
                updateUser({
                  preferences: {
                    ...currentUser.preferences,
                    reminderTime: e.target.value,
                  },
                })
              }
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00A39D]" />
            Daten verwalten
          </h2>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-400" />
              <span>Daten exportieren</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              <span>Alle Daten löschen</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* About */}
      <Card>
        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[#00A39D]" />
            <span className="font-medium">Über VorsorgeGuide</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 py-4">
        <p>Hack Winterthur 2026 VorsorgeGuide v1.0.0</p>
        <p className="flex items-center justify-center gap-1 mt-1">
          Made with <Heart className="w-4 h-4 text-red-500" /> in Winterthur
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Daten löschen?"
      >
        <div className="py-4">
          <p className="text-gray-500 mb-6">
            Bist du sicher, dass du alle deine Daten löschen möchtest? Diese Aktion kann nicht
            rückgängig gemacht werden.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleResetData}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              Daten löschen
            </Button>
          </div>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="Über VorsorgeGuide"
      >
        <div className="py-4 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#00A39D] flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Hack Winterthur 2026 VorsorgeGuide</h3>
          <p className="text-gray-500 mb-4">Version 1.0.0</p>
          <p className="text-sm text-gray-400 mb-6">
            Dein persönlicher Begleiter für ein gesünderes Leben. Basierend auf wissenschaftlichen
            Erkenntnissen helfen wir dir, Vorsorge-Aufgaben spielerisch zu erledigen.
          </p>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              © 2026 Hack Winterthur
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
