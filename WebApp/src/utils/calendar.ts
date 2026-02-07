// ============================================
// Calendar Export Utilities
// ============================================

import { format } from 'date-fns';

/**
 * Creates an iCalendar (.ics) file content for a task
 */
export function createCalendarEvent(
    title: string,
    description: string,
    startDate: Date,
    duration: string,
    location?: string
): string {
    // Parse duration (e.g., "30min", "1h", "2h 30min")
    const durationInMinutes = parseDuration(duration);

    // Calculate end time
    const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);

    // Format dates for iCal (YYYYMMDDTHHMMSS)
    const formatICalDate = (date: Date) => {
        return format(date, "yyyyMMdd'T'HHmmss");
    };

    // Create unique ID
    const uid = `${Date.now()}@swica-health-app.com`;

    // Build iCal content
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SWICA Health App//DE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICalDate(new Date())}`,
        `DTSTART:${formatICalDate(startDate)}`,
        `DTEND:${formatICalDate(endDate)}`,
        `SUMMARY:${escapeICalText(title)}`,
        `DESCRIPTION:${escapeICalText(description)}`,
        location ? `LOCATION:${escapeICalText(location)}` : '',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Erinnerung: ${escapeICalText(title)}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ]
        .filter(Boolean)
        .join('\r\n');

    return icsContent;
}

/**
 * Escapes special characters in iCal text fields
 */
function escapeICalText(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

/**
 * Parses duration string and returns minutes
 */
function parseDuration(duration: string): number {
    let totalMinutes = 0;

    // Match hours (e.g., "1h", "2h")
    const hoursMatch = duration.match(/(\d+)\s*h/i);
    if (hoursMatch) {
        totalMinutes += parseInt(hoursMatch[1]) * 60;
    }

    // Match minutes (e.g., "30min", "45min")
    const minutesMatch = duration.match(/(\d+)\s*min/i);
    if (minutesMatch) {
        totalMinutes += parseInt(minutesMatch[1]);
    }

    // Default to 30 minutes if nothing matched
    return totalMinutes || 30;
}

/**
 * Downloads the calendar file
 */
export function downloadCalendarFile(icsContent: string, filename: string): void {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Opens the calendar event in the default calendar app (mobile-friendly)
 */
export function openInCalendar(icsContent: string): void {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Try to open in calendar app (works on mobile)
    window.open(url, '_blank');

    // Fallback: download the file
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * Creates a Google Calendar URL
 */
export function createGoogleCalendarUrl(
    title: string,
    description: string,
    startDate: Date,
    duration: string
): string {
    const durationInMinutes = parseDuration(duration);
    const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);

    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatGoogleDate = (date: Date) => {
        return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: description,
        dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Creates an Outlook Calendar URL
 */
export function createOutlookCalendarUrl(
    title: string,
    description: string,
    startDate: Date,
    duration: string
): string {
    const durationInMinutes = parseDuration(duration);
    const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);

    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: title,
        body: description,
        startdt: startDate.toISOString(),
        enddt: endDate.toISOString(),
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
