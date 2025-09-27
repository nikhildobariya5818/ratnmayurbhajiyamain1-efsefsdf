export type DetectedScript = "latin" | "devanagari" | "gujarati" | "mixed"

/**
 * Detects the script/language of input text
 * @param text - The input text to analyze
 * @returns The detected script type
 */
export function detectTextScript(text: string): DetectedScript {
  if (!text || text.trim().length === 0) {
    return "latin"
  }

  // Remove spaces, numbers, and common punctuation for analysis
  const cleanText = text.replace(/[\s\d\p{P}]/gu, "")

  if (cleanText.length === 0) {
    return "latin"
  }

  let latinCount = 0
  let devanagariCount = 0
  let gujaratiCount = 0

  for (const char of cleanText) {
    const code = char.codePointAt(0)
    if (!code) continue

    // Latin script (English)
    if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a)) {
      latinCount++
    }
    // Devanagari script (Hindi)
    else if (code >= 0x0900 && code <= 0x097f) {
      devanagariCount++
    }
    // Gujarati script
    else if (code >= 0x0a80 && code <= 0x0aff) {
      gujaratiCount++
    }
  }

  const total = latinCount + devanagariCount + gujaratiCount
  if (total === 0) return "latin"

  // Determine dominant script
  const latinPercent = (latinCount / total) * 100
  const devanagariPercent = (devanagariCount / total) * 100
  const gujaratiPercent = (gujaratiCount / total) * 100

  // If mixed scripts (no single script dominates with >70%)
  if (Math.max(latinPercent, devanagariPercent, gujaratiPercent) < 70) {
    return "mixed"
  }

  // Return the dominant script
  if (gujaratiPercent > devanagariPercent && gujaratiPercent > latinPercent) {
    return "gujarati"
  } else if (devanagariPercent > latinPercent) {
    return "devanagari"
  } else {
    return "latin"
  }
}

/**
 * Gets appropriate font family for the detected script
 * @param script - The detected script type
 * @returns CSS font family string
 */
export function getFontForScript(script: DetectedScript): string {
  switch (script) {
    case "devanagari":
      return "font-sans" // Uses system fonts that support Devanagari
    case "gujarati":
      return "font-sans" // Uses system fonts that support Gujarati
    case "mixed":
      return "font-sans" // Default to system fonts for mixed content
    case "latin":
    default:
      return "font-sans"
  }
}

/**
 * Gets appropriate text direction for the script
 * @param script - The detected script type
 * @returns CSS direction value
 */
export function getDirectionForScript(script: DetectedScript): "ltr" | "rtl" {
  // All supported scripts (Latin, Devanagari, Gujarati) are LTR
  return "ltr"
}

/**
 * Applies appropriate styling classes for multilingual text
 * @param script - The detected script type
 * @returns Object with CSS classes and styles
 */
export function getMultilingualStyles(script: DetectedScript) {
  return {
    fontFamily: getFontForScript(script),
    direction: getDirectionForScript(script),
    className: `${getFontForScript(script)} text-${getDirectionForScript(script)}`,
  }
}
