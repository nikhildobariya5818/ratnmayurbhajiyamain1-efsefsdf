// Database connection and utilities
// Note: This would typically connect to MongoDB using Motor in the FastAPI backend
// For the frontend, we'll create mock data and API interfaces

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// API client functions
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Ingredient scaling utility
export function scaleIngredients(
  menuItems: Array<{
    menuItemId: string
    name: string
    category: string
    type: string
    selectedType?: string
    ingredients: Array<{
      ingredientId: string
      ingredientName: string
      unit: string
      quantityPer100?: number
      isDefaultIngredient?: boolean
      quantities?: {
        onlyBhajiyaKG: number
        dishWithOnlyBhajiya: number
        dishHaveNoChart: number
        dishHaveChartAndBhajiya: number
      }
    }>
  }>,
  numberOfPeople: number,
): Array<{
  ingredientId: string
  ingredientName: string
  unit: string
  totalQuantity: number
  isDefault?: boolean
}> {
  const scaledIngredients = new Map<
    string,
    {
      ingredientId: string
      ingredientName: string
      unit: string
      totalQuantity: number
      isDefault?: boolean
    }
  >()

  const scalingFactor = numberOfPeople / 100

  menuItems.forEach((menuItem) => {
    menuItem.ingredients?.forEach((ingredient) => {
      const quantityPer100 = ingredient.quantityPer100 || 0

      const scaledQuantity = quantityPer100 * scalingFactor

      // Round based on unit type
      const roundedQuantity = ["piece"].includes(ingredient.unit)
        ? Math.round(scaledQuantity)
        : Math.round(scaledQuantity * 100) / 100

      if (scaledIngredients.has(ingredient.ingredientId)) {
        const existing = scaledIngredients.get(ingredient.ingredientId)!
        existing.totalQuantity += roundedQuantity

        // Re-round after aggregation
        existing.totalQuantity = ["piece"].includes(ingredient.unit)
          ? Math.round(existing.totalQuantity)
          : Math.round(existing.totalQuantity * 100) / 100
      } else {
        scaledIngredients.set(ingredient.ingredientId, {
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.ingredientName,
          unit: ingredient.unit,
          totalQuantity: roundedQuantity,
          isDefault: ingredient.isDefaultIngredient,
        })
      }
    })
  })

  return Array.from(scaledIngredients.values()).sort((a, b) => {
    // Sort default ingredients first
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1
    }
    return a.ingredientName.localeCompare(b.ingredientName)
  })
}

export function scaleIngredientsWithMenuItems(
  menuItems: Array<{
    selectedType: "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya"
    ingredients: Array<{
      ingredientId: string
      ingredientName: string
      unit: string
      isDefaultIngredient: boolean
      ingredient?: {
        defaultValue?: number
        incrementThreshold?: number
        incrementAmount?: number
      }
      quantities: {
        onlyBhajiyaKG: number
        dishWithOnlyBhajiya: number
        dishHaveNoChart: number
        dishHaveChartAndBhajiya: number
      }
    }>
  }>,
  numberOfPeople: number,
): Array<{
  ingredientId: string
  ingredientName: string
  unit: string
  totalQuantity: number
  isDefault: boolean
  menuItemCount: number
}> {
  const scaledIngredients = new Map<
    string,
    {
      ingredientId: string
      ingredientName: string
      unit: string
      totalQuantity: number
      isDefault: boolean
      menuItemCount: number
    }
  >()

  const scalingFactor = numberOfPeople / 100

  menuItems.forEach((menuItem) => {
    if (!menuItem || !menuItem.ingredients) {
      return
    }

    menuItem.ingredients.forEach((ingredient) => {
      if (!ingredient || !ingredient.ingredientId) {
        return
      }

      if (scaledIngredients.has(ingredient.ingredientId)) {
        const existing = scaledIngredients.get(ingredient.ingredientId)!
        existing.menuItemCount += 1
      } else {
        scaledIngredients.set(ingredient.ingredientId, {
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.ingredientName,
          unit: ingredient.unit,
          totalQuantity: 0,
          isDefault: ingredient.isDefaultIngredient,
          menuItemCount: 1,
        })
      }
    })
  })

  menuItems.forEach((menuItem) => {
    if (!menuItem || !menuItem.ingredients) {
      return
    }

    menuItem.ingredients.forEach((ingredient) => {
      if (!ingredient || !ingredient.ingredientId) {
        return
      }

      const ingredientData = scaledIngredients.get(ingredient.ingredientId)!
      let quantityPer100 = 0

      if (ingredient.isDefaultIngredient) {
        const menuItemCount = ingredientData.menuItemCount
        const baseQuantity = ingredient.ingredient?.defaultValue ?? 12
        const threshold = ingredient.ingredient?.incrementThreshold ?? 3
        const increment = ingredient.ingredient?.incrementAmount ?? 3

        if (menuItemCount <= threshold) {
          quantityPer100 = baseQuantity
        } else {
          quantityPer100 = baseQuantity + (menuItemCount - threshold) * increment
        }
      } else {
        const quantities = ingredient.quantities || {
          onlyBhajiyaKG: 0,
          dishWithOnlyBhajiya: 0,
          dishHaveNoChart: 0,
          dishHaveChartAndBhajiya: 0,
        }

        switch (menuItem.selectedType) {
          case "only_bhajiya_kg":
            quantityPer100 = quantities.onlyBhajiyaKG
            break
          case "dish_with_only_bhajiya":
            quantityPer100 = quantities.dishWithOnlyBhajiya
            break
          case "dish_have_no_chart":
            quantityPer100 = quantities.dishHaveNoChart
            break
          case "dish_have_chart_bhajiya":
            quantityPer100 = quantities.dishHaveChartAndBhajiya
            break
          default:
            quantityPer100 = 0
        }
      }

      const scaledQuantity = quantityPer100 * scalingFactor

      const roundedQuantity = ["piece"].includes(ingredient.unit)
        ? Math.round(scaledQuantity)
        : Math.round(scaledQuantity * 100) / 100

      if (ingredientData.totalQuantity === 0) {
        ingredientData.totalQuantity = roundedQuantity
      }
    })
  })

  const result = Array.from(scaledIngredients.values()).sort((a, b) => {
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1
    }
    return a.ingredientName.localeCompare(b.ingredientName)
  })

  return result
}

export function scaleIngredientsWithDualValues(
  menuItems: Array<{
    selectedType: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart"
    ingredients: Array<{
      ingredientId: string
      ingredientName: string
      unit: string
      singleItems?: {
        onlyDishQuantity: number
        onlyDishWithChartQuantity: number
        dishWithoutChartQuantity: number
        dishWithChartQuantity: number
      }
      multiItems?: {
        onlyDishQuantity: number
        onlyDishWithChartQuantity: number
        dishWithoutChartQuantity: number
        dishWithChartQuantity: number
      }
      quantityPer100?: number
    }>
  }>,
  numberOfPeople: number,
): Array<{
  ingredientId: string
  ingredientName: string
  unit: string
  totalQuantity: number
}> {
  const scaledIngredients = new Map<
    string,
    {
      ingredientId: string
      ingredientName: string
      unit: string
      totalQuantity: number
      menuItemsUsingThis: number
    }
  >()

  const scalingFactor = numberOfPeople / 100

  menuItems.forEach((menuItem) => {
    if (!menuItem || !menuItem.ingredients) {
      return
    }

    menuItem.ingredients.forEach((ingredient) => {
      if (!ingredient || !ingredient.ingredientId) {
        return
      }

      const hasDualValues = ingredient.singleItems && ingredient.multiItems
      const hasLegacyValue = ingredient.quantityPer100 !== undefined

      if (!hasDualValues && !hasLegacyValue) {
        return
      }

      if (scaledIngredients.has(ingredient.ingredientId)) {
        const existing = scaledIngredients.get(ingredient.ingredientId)!
        existing.menuItemsUsingThis += 1
      } else {
        scaledIngredients.set(ingredient.ingredientId, {
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.ingredientName || "Unknown Ingredient",
          unit: ingredient.unit || "unit",
          totalQuantity: 0,
          menuItemsUsingThis: 1,
        })
      }
    })
  })

  menuItems.forEach((menuItem) => {
    if (!menuItem || !menuItem.ingredients) {
      return
    }

    menuItem.ingredients.forEach((ingredient) => {
      if (!ingredient || !ingredient.ingredientId) {
        return
      }

      const ingredientData = scaledIngredients.get(ingredient.ingredientId)
      if (!ingredientData) {
        return
      }

      let quantityPer100 = 0

      if (ingredient.singleItems && ingredient.multiItems) {
        const useSingleValues = ingredientData.menuItemsUsingThis === 1
        quantityPer100 = useSingleValues
          ? getQuantityForType(ingredient.singleItems, menuItem.selectedType)
          : getQuantityForType(ingredient.multiItems, menuItem.selectedType)
      } else if (ingredient.quantityPer100 !== undefined) {
        quantityPer100 = ingredient.quantityPer100
      }

      const scaledQuantity = quantityPer100 * scalingFactor

      const roundedQuantity = ["piece"].includes(ingredient.unit)
        ? Math.round(scaledQuantity)
        : Math.round(scaledQuantity * 100) / 100

      ingredientData.totalQuantity += roundedQuantity

      ingredientData.totalQuantity = ["piece"].includes(ingredient.unit)
        ? Math.round(ingredientData.totalQuantity)
        : Math.round(ingredientData.totalQuantity * 100) / 100
    })
  })

  const result = Array.from(scaledIngredients.values()).map(({ menuItemsUsingThis, ...rest }) => rest)
  return result
}

export function getQuantityForType(
  ingredient:
    | {
        onlyDishQuantity: number
        onlyDishWithChartQuantity: number
        dishWithoutChartQuantity: number
        dishWithChartQuantity: number
      }
    | undefined,
  type: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart",
): number {
  if (!ingredient) {
    return 0
  }

  switch (type) {
    case "only_dish":
      return ingredient.onlyDishQuantity ?? 0
    case "only_dish_with_chart":
      return ingredient.onlyDishWithChartQuantity ?? 0
    case "dish_without_chart":
      return ingredient.dishWithoutChartQuantity ?? 0
    case "dish_with_chart":
      return ingredient.dishWithChartQuantity ?? 0
    default:
      return ingredient.onlyDishQuantity ?? 0
  }
}

export function getQuantityForTypeFromDualValues(
  singleItems:
    | {
        onlyDishQuantity: number
        onlyDishWithChartQuantity: number
        dishWithoutChartQuantity: number
        dishWithChartQuantity: number
      }
    | undefined,
  multiItems:
    | {
        onlyDishQuantity: number
        onlyDishWithChartQuantity: number
        dishWithoutChartQuantity: number
        dishWithChartQuantity: number
      }
    | undefined,
  type: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart",
  useSingleValues: boolean,
): number {
  const values = useSingleValues ? singleItems : multiItems
  if (!values) {
    return 0
  }
  return getQuantityForType(values, type)
}

export function getQuantityForNewTypes(
  quantities:
    | {
        onlyBhajiyaKG: number
        dishWithOnlyBhajiya: number
        dishHaveNoChart: number
        dishHaveChartAndBhajiya: number
      }
    | undefined,
  type: "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya",
  isDefaultIngredient?: boolean,
  defaultValue?: number,
): number {
  if (isDefaultIngredient && defaultValue) {
    return defaultValue
  }

  if (!quantities) {
    return 0
  }

  switch (type) {
    case "only_bhajiya_kg":
      return quantities.onlyBhajiyaKG ?? 0
    case "dish_with_only_bhajiya":
      return quantities.dishWithOnlyBhajiya ?? 0
    case "dish_have_no_chart":
      return quantities.dishHaveNoChart ?? 0
    case "dish_have_chart_bhajiya":
      return quantities.dishHaveChartAndBhajiya ?? 0
    default:
      return quantities.onlyBhajiyaKG ?? 0
  }
}
