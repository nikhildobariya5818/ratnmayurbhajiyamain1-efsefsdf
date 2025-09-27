/**
 * Utility functions for handling date formatting
 */

/**
 * Safely formats a date string or Date object to a localized date string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString()
  } catch (error) {
    return "Invalid date"
  }
}

/**
 * Safely formats a date string or Date object to a localized date and time string
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleString()
  } catch (error) {
    return "Invalid date"
  }
}

/**
 * Safely formats a date string or Date object to a relative time string
 * @param date - Date string or Date object
 * @returns Relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months} month${months > 1 ? "s" : ""} ago`
    } else {
      const years = Math.floor(diffInDays / 365)
      return `${years} year${years > 1 ? "s" : ""} ago`
    }
  } catch (error) {
    return "Unknown"
  }
}
