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
 * Formats a date to DD-MM-YYYY format
 */
function formatDateForFilename(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const day = String(dateObj.getDate()).padStart(2, "0")
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const year = dateObj.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Generates a PDF filename based on client name and order date
 * Format: ClientName_DD-MM-YYYY_order.pdf
 */
export function generatePDFFilename(clientName: string, orderDate: string | Date): string {
  const sanitizedClientName = sanitizeForFilename(clientName)
  const formattedDate = formatDateForFilename(orderDate)
  const finalClientName = sanitizedClientName || "Unknown_Client"
  return `${finalClientName}_${formattedDate}_order.pdf`
}
