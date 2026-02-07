import { X, Gift, ExternalLink, Trophy, Zap, Star } from 'lucide-react';
import { Modal } from './Modal';

interface PointsInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPoints: number;
}

export function PointsInfoModal({ isOpen, onClose, currentPoints }: PointsInfoModalProps) {
    const benevitaUrl = 'https://www.benevita.ch';

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-amber-500 p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Trophy className="w-8 h-8 text-white" />
                                <h2 className="text-2xl font-bold text-white">Ihre Punkte</h2>
                            </div>
                            <p className="text-yellow-100 text-sm">
                                Tauschen Sie Ihre Punkte über Benevita gegen attraktive Prämien ein
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Points Display */}
                    <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-yellow-100 text-sm mb-1">Ihr aktueller Punktestand</p>
                        <p className="text-4xl font-bold text-white">{currentPoints.toLocaleString('de-CH')}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* What is Benevita */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-teal-500" />
                            Was ist Benevita?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Benevita ist das Bonusprogramm Ihrer Krankenversicherung. Mit Ihren gesammelten
                            Punkten können Sie attraktive Prämien einlösen - von Gesundheitsprodukten über
                            Gutscheine bis hin zu Rabatten auf Ihre Versicherungsprämie.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5 text-teal-500" />
                            Mögliche Prämien
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-4 h-4 text-teal-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Prämienrabatte</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Reduzieren Sie Ihre Krankenversicherungsprämie
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <Gift className="w-4 h-4 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Gesundheitsprodukte</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Fitness-Tracker, Sportausrüstung, Wellness-Produkte
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Gutscheine & Rabatte</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Partner-Gutscheine für Sport, Fitness und Gesundheit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How to redeem */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">So lösen Sie Ihre Punkte ein</h3>
                        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-teal-500 min-w-[24px]">1.</span>
                                <span>Besuchen Sie die Benevita-Website oder App</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-teal-500 min-w-[24px]">2.</span>
                                <span>Melden Sie sich mit Ihren Versicherungsdaten an</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-teal-500 min-w-[24px]">3.</span>
                                <span>Wählen Sie Ihre gewünschte Prämie aus</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-teal-500 min-w-[24px]">4.</span>
                                <span>Tauschen Sie Ihre Punkte ein</span>
                            </li>
                        </ol>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t dark:border-gray-700">
                        <a
                            href={benevitaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                        >
                            Zu Benevita
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                            Sie verlassen VorsorgeGuide und werden zu Benevita weitergeleitet
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
