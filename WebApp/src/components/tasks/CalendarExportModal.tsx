// ============================================
// Calendar Export Modal
// ============================================

import { memo } from 'react';
import { X, Calendar, Download, ExternalLink } from 'lucide-react';
import { Modal } from '../ui';
import {
    createCalendarEvent,
    downloadCalendarFile,
    createGoogleCalendarUrl,
    createOutlookCalendarUrl
} from '../../utils/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface CalendarExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskTitle: string;
    taskDescription: string;
    dueDate: Date;
    duration: string;
}

export const CalendarExportModal = memo(({
    isOpen,
    onClose,
    taskTitle,
    taskDescription,
    dueDate,
    duration,
}: CalendarExportModalProps) => {

    const handleDownloadICS = () => {
        const icsContent = createCalendarEvent(
            taskTitle,
            taskDescription,
            dueDate,
            duration
        );
        const filename = `${taskTitle.replace(/[^a-z0-9]/gi, '_')}.ics`;
        downloadCalendarFile(icsContent, filename);
    };

    const handleGoogleCalendar = () => {
        const url = createGoogleCalendarUrl(taskTitle, taskDescription, dueDate, duration);
        window.open(url, '_blank');
    };

    const handleOutlookCalendar = () => {
        const url = createOutlookCalendarUrl(taskTitle, taskDescription, dueDate, duration);
        window.open(url, '_blank');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Zum Kalender hinzufügen</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Wähle deinen bevorzugten Kalender
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Task Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-6">
                    <h3 className="font-semibold mb-2">{taskTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(dueDate, 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr
                        </span>
                        <span>• {duration}</span>
                    </div>
                </div>

                {/* Calendar Options */}
                <div className="space-y-3">
                    {/* Google Calendar */}
                    <button
                        onClick={handleGoogleCalendar}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#00A39D] hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                            📅
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold group-hover:text-[#00A39D]">Google Calendar</p>
                            <p className="text-sm text-gray-500">Im Browser öffnen</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#00A39D]" />
                    </button>

                    {/* Outlook Calendar */}
                    <button
                        onClick={handleOutlookCalendar}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#00A39D] hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                            📧
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold group-hover:text-[#00A39D]">Outlook Calendar</p>
                            <p className="text-sm text-gray-500">Im Browser öffnen</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#00A39D]" />
                    </button>

                    {/* Apple Calendar / Other (Download ICS) */}
                    <button
                        onClick={handleDownloadICS}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#00A39D] hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xl flex-shrink-0">
                            🍎
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold group-hover:text-[#00A39D]">Apple / Andere Kalender</p>
                            <p className="text-sm text-gray-500">ICS-Datei herunterladen</p>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-[#00A39D]" />
                    </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Tipp:</strong> Der Termin wird mit einer 15-Minuten-Erinnerung erstellt.
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    Abbrechen
                </button>
            </div>
        </Modal>
    );
});

CalendarExportModal.displayName = 'CalendarExportModal';

export default CalendarExportModal;
