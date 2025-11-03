import type { Order } from "@/lib/types"

interface IngredientQuantity {
  ingredientId: string
  ingredientName: string
  unit: string
  baseQuantityPer100: number
  isDefault: boolean
  totalForOrder: number
}

/**
 * Calculate ingredient quantities for an order with special handling for default ingredients
 * When 3+ menu items share the same default ingredient, add 3kg to that ingredient
 */
export function calculateOrderIngredients(order: Order): IngredientQuantity[] {
  const ingredientMap = new Map<string, IngredientQuantity>()
  const defaultIngredientCounts = new Map<string, number>() // Count how many menu items use each default ingredient

  // First pass: count default ingredients across menu items
  order.menuItems.forEach((menuItem) => {
    menuItem.ingredients.forEach((ing) => {
      if (ing.isDefaultIngredient) {
        const count = defaultIngredientCounts.get(ing.ingredientId) || 0
        defaultIngredientCounts.set(ing.ingredientId, count + 1)
      }
    })
  })

  // Second pass: calculate quantities
  order.menuItems.forEach((menuItem) => {
    menuItem.ingredients.forEach((ing) => {
      const key = ing.ingredientId

      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          ingredientId: ing.ingredientId,
          ingredientName: ing.ingredientName,
          unit: ing.unit,
          baseQuantityPer100: ing.quantityPer100,
          isDefault: ing.isDefaultIngredient,
          totalForOrder: 0,
        })
      }

      const existing = ingredientMap.get(key)!
      // Scale quantity based on number of people (order.numberOfPeople / 100)
      const scaledQuantity = (ing.quantityPer100 * order.numberOfPeople) / 100
      existing.totalForOrder += scaledQuantity
    })
  })

  // Third pass: apply default ingredient aggregation (add 3kg if 3+ menu items share same default)
  ingredientMap.forEach((ing, ingredientId) => {
    if (ing.isDefault && defaultIngredientCounts.get(ingredientId)! >= 3) {
      ing.totalForOrder += 3 // Add 3kg for aggregation
    }
  })

  return Array.from(ingredientMap.values())
}
