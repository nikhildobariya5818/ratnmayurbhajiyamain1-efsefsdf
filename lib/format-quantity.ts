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

/**
 * Format quantity based on its unit type
 * Supports: gram (g), kilogram (kg), milliliter (ml), liter (L), piece, જબલા
 */
export function formatQuantityByUnit(quantity: number, unit: string): string {
  if (!unit) return `${quantity}`

  const unitMap: { [key: string]: string } = {
    gram: "g",
    kg: "kg",
    ml: "ml",
    L: "L",
    piece: "piece",
    જબલા: "જબલા",
  }

  const displayUnit = unitMap[unit] || unit

  // Format based on unit type
  switch (unit) {
    case "gram":
      return quantity <= 0 ? "0 g" : `${quantity} g`
    case "kg":
      // For kg, break into kg and g if there are grams
      if (quantity <= 0) return "0 kg"
      const totalGm = Math.round(quantity * 1000)
      const wholeKg = Math.floor(totalGm / 1000)
      const remainingGm = totalGm % 1000
      if (remainingGm > 0) {
        return `${wholeKg} kg and ${remainingGm} g`
      }
      return `${wholeKg} kg`
    case "ml":
      return quantity <= 0 ? "0 ml" : `${quantity} ml`
    case "L":
      // For liters, break into L and ml if there are milliliters
      if (quantity <= 0) return "0 L"
      const totalMl = Math.round(quantity * 1000)
      const wholeLiters = Math.floor(totalMl / 1000)
      const remainingMl = totalMl % 1000
      if (remainingMl > 0) {
        return `${wholeLiters} L and ${remainingMl} ml`
      }
      return `${wholeLiters} L`
    case "piece":
      return quantity <= 0 ? "0 piece" : `${Math.round(quantity)} piece${Math.round(quantity) !== 1 ? "s" : ""}`
    case "જબલા":
      return quantity <= 0 ? "0 જબલા" : `${quantity} જબલા`
    default:
      return `${quantity} ${displayUnit}`
  }
}

/**
 * Format quantity by unit with i18n support
 */
export function formatQuantityByUnitI18n(quantity: number, unit: string, t: any): string {
  if (!unit) return `${quantity}`

  const unitLabels = {
    gram: t.gram || "g",
    kg: t.kilogram || "kg",
    ml: t.milliliter || "ml",
    L: t.liter || "L",
    piece: t.piece || "piece",
    જબલા: t.gujarati_unit || "જબલા",
  }

  const displayUnit = unitLabels[unit as keyof typeof unitLabels] || unit

  switch (unit) {
    case "gram":
      return quantity <= 0 ? `0 ${displayUnit}` : `${quantity} ${displayUnit}`
    case "kg":
      if (quantity <= 0) return `0 ${displayUnit}`
      const totalGm = Math.round(quantity * 1000)
      const wholeKg = Math.floor(totalGm / 1000)
      const remainingGm = totalGm % 1000
      if (remainingGm > 0) {
        return `${wholeKg} ${displayUnit} ${t.and || "and"} ${remainingGm} ${unitLabels.gram}`
      }
      return `${wholeKg} ${displayUnit}`
    case "ml":
      return quantity <= 0 ? `0 ${displayUnit}` : `${quantity} ${displayUnit}`
    case "L":
      if (quantity <= 0) return `0 ${displayUnit}`
      const totalMl = Math.round(quantity * 1000)
      const wholeLiters = Math.floor(totalMl / 1000)
      const remainingMl = totalMl % 1000
      if (remainingMl > 0) {
        return `${wholeLiters} ${displayUnit} ${t.and || "and"} ${remainingMl} ${unitLabels.ml}`
      }
      return `${wholeLiters} ${displayUnit}`
    case "piece":
      const pieceQty = Math.round(quantity)
      return `${pieceQty} ${displayUnit}${pieceQty !== 1 ? "s" : ""}`
    case "જબલા":
      return quantity <= 0 ? `0 ${displayUnit}` : `${quantity} ${displayUnit}`
    default:
      return `${quantity} ${displayUnit}`
  }
}
