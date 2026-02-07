// ============================================
// Timer Component for Meditation & Exercises
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface TimerProps {
  defaultMinutes?: number;
  onComplete?: () => void;
  taskTitle?: string;
}

const PRESET_DURATIONS = [
  { label: '1 min', minutes: 1 },
  { label: '3 min', minutes: 3 },
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
];

export function Timer({ defaultMinutes = 5, onComplete, taskTitle }: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a gentle completion sound
  const playCompletionSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      // Play a gentle bell-like tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(528, ctx.currentTime); // "Love frequency" - soothing
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playCompletionSound();
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds, onComplete, playCompletionSound]);

  const toggleTimer = () => {
    if (isComplete) {
      resetTimer();
      return;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
  };

  const setDuration = (minutes: number) => {
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
    setIsRunning(false);
    setIsComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 90; // radius = 90

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Duration Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_DURATIONS.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => setDuration(preset.minutes)}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              totalSeconds === preset.minutes * 60
                ? 'bg-[#00A39D] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-52 h-52">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A39D" />
              <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <span className="text-4xl">🎉</span>
                <p className="text-lg font-semibold text-[#00A39D] mt-2">Fertig!</p>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <span className="text-4xl font-bold tabular-nums">
                  {formatTime(remainingSeconds)}
                </span>
                {isRunning && (
                  <p className="text-sm text-gray-500 mt-1">
                    Bleib fokussiert 🧘
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={soundEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
            isComplete
              ? 'bg-[#FFB800] hover:bg-[#E5A600]'
              : isRunning
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-[#00A39D] hover:bg-[#008C87]'
          }`}
        >
          {isComplete ? (
            <RotateCcw className="w-7 h-7" />
          ) : isRunning ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </motion.button>

        <button
          onClick={resetTimer}
          disabled={remainingSeconds === totalSeconds && !isComplete}
          className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors ${
            remainingSeconds === totalSeconds && !isComplete
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Zurücksetzen"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Breathing Guide (for breathing exercises) */}
      {isRunning && taskTitle?.toLowerCase().includes('atem') && (
        <BreathingGuide />
      )}
    </div>
  );
}

// Animated breathing guide for breathing exercises
function BreathingGuide() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const cycle = () => {
      // 4-7-8 breathing pattern
      setPhase('inhale');
      setCount(4);
      
      let countdown = 4;
      const inhaleInterval = setInterval(() => {
        countdown--;
        setCount(countdown);
        if (countdown === 0) {
          clearInterval(inhaleInterval);
          
          // Hold phase
          setPhase('hold');
          setCount(7);
          countdown = 7;
          
          const holdInterval = setInterval(() => {
            countdown--;
            setCount(countdown);
            if (countdown === 0) {
              clearInterval(holdInterval);
              
              // Exhale phase
              setPhase('exhale');
              setCount(8);
              countdown = 8;
              
              const exhaleInterval = setInterval(() => {
                countdown--;
                setCount(countdown);
                if (countdown === 0) {
                  clearInterval(exhaleInterval);
                  cycle(); // Restart cycle
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 1000);
    };

    cycle();
    
    return () => {
      // Cleanup handled by component unmount
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-4 bg-gradient-to-r from-[#00A39D]/10 to-[#FFB800]/10 rounded-xl"
    >
      <motion.div
        animate={{
          scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 1,
        }}
        transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.3 }}
        className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00A39D] to-[#FFB800] opacity-60"
      />
      <p className="text-lg font-semibold text-[#00A39D]">
        {phase === 'inhale' && 'Einatmen...'}
        {phase === 'hold' && 'Halten...'}
        {phase === 'exhale' && 'Ausatmen...'}
      </p>
      <p className="text-2xl font-bold">{count}</p>
    </motion.div>
  );
}

export default Timer;
