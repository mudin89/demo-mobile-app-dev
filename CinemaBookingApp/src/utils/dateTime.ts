/**
 * Date and time utility functions
 * Following SOLID principles - Single Responsibility for date/time formatting
 */

/**
 * Format date to show only Month and Year (e.g., "September 2025")
 * @param dateString - Date string to format
 * @returns Formatted date string showing month and year only
 */
export const formatReleaseDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Unknown';
    }

    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting release date:', error);
    return 'Unknown';
  }
};

/**
 * Format duration from minutes to hours and minutes (e.g., "2h 15m")
 * @param durationInMinutes - Duration in minutes
 * @returns Formatted duration string in hours and minutes
 */
export const formatDuration = (durationInMinutes: number): string => {
  try {
    if (durationInMinutes <= 0) {
      return 'Unknown';
    }

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  } catch (error) {
    console.error('Error formatting duration:', error);
    return 'Unknown';
  }
};

/**
 * Format time for display (existing function for consistency)
 * @param timeString - Time string to format
 * @returns Formatted time string
 */
export const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid time string:', timeString);
      return 'Invalid Time';
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

/**
 * Format full date for display (existing function for consistency)
 * @param dateString - Date string to format
 * @returns Formatted full date string
 */
export const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
