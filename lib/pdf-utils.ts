/**
 * Utility functions for PDF generation and naming
 */

/**
 * Sanitizes a string to be safe for use in filenames
 * Removes special characters and replaces spaces with underscores
 */
function sanitizeForFilename(text: string): string {
  return text
    .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
    .substring(0, 50) // Limit length to 50 characters
}

/**
 * Formats a date to YYYY-MM-DD format
 */
function formatDateForFilename(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString().split("T")[0]
}

/**
 * Generates a PDF filename based on client name and order date
 * Format: ClientName_YYYY-MM-DD_order.pdf
 */
export function generatePDFFilename(clientName: string, orderDate: string | Date): string {
  const sanitizedClientName = sanitizeForFilename(clientName)
  const formattedDate = formatDateForFilename(orderDate)

  // If client name is empty or becomes empty after sanitization, use "Unknown_Client"
  const finalClientName = sanitizedClientName || "Unknown_Client"

  return `${finalClientName}_${formattedDate}_order.pdf`
}
