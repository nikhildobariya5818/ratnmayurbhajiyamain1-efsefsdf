/**
 * Format quantity in kg to a readable format with kg and gm
 * Examples:
 * 0.800 -> "800 gm"
 * 1.250 -> "1 kg and 250 gm"
 * 12 -> "12 kg"
 * 2.5 -> "2 kg and 500 gm"
 */
export function formatQuantityWithUnit(kg: number): { value: string; parts: { kg?: number; gm?: number } } {
  if (kg <= 0) return { value: "0 gm", parts: { gm: 0 } }

  // Convert kg to gm to avoid floating point issues
  const totalGm = Math.round(kg * 1000)
  const wholeKg = Math.floor(totalGm / 1000)
  const remainingGm = totalGm % 1000

  const parts: { kg?: number; gm?: number } = {}
  let value = ""

  if (wholeKg > 0) {
    parts.kg = wholeKg
    value = `${wholeKg} kg`
  }

  if (remainingGm > 0) {
    parts.gm = remainingGm
    if (value) {
      value += ` and ${remainingGm} gm`
    } else {
      value = `${remainingGm} gm`
    }
  }

  if (!value) {
    value = "0 gm"
    parts.gm = 0
  }

  return { value, parts }
}

/**
 * Format quantity with i18n support
 */
export function formatQuantityI18n(kg: number, t: any): string {
  if (kg <= 0) return `0 ${t.gram || "gm"}`

  const totalGm = Math.round(kg * 1000)
  const wholeKg = Math.floor(totalGm / 1000)
  const remainingGm = totalGm % 1000

  let value = ""

  if (wholeKg > 0) {
    value = `${wholeKg} ${t.kilogram || "kg"}`
  }

  if (remainingGm > 0) {
    const gmText = `${remainingGm} ${t.gram || "gm"}`
    if (value) {
      value += ` ${t.and || "and"} ${gmText}`
    } else {
      value = gmText
    }
  }

  if (!value) {
    value = `0 ${t.gram || "gm"}`
  }

  return value
}
