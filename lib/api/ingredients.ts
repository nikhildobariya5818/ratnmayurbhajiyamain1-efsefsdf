import type { Ingredient, ApiResponse } from "@/lib/types"

const API_BASE = "/api/ingredients"

export async function fetchIngredients(searchTerm?: string, unit?: string): Promise<Ingredient[]> {
  const params = new URLSearchParams()
  if (searchTerm) params.append("search", searchTerm)
  if (unit) params.append("unit", unit)

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE

  const response = await fetch(url)
  const result: ApiResponse<Ingredient[]> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ingredients")
  }

  return result.data || []
}

export async function fetchIngredient(id: string): Promise<Ingredient> {
  const response = await fetch(`${API_BASE}/${id}`)
  const result: ApiResponse<Ingredient> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ingredient")
  }

  if (!result.data) {
    throw new Error("Ingredient not found")
  }

  return result.data
}

export async function createIngredient(
  ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">,
): Promise<Ingredient> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredientData),
  })

  const result: ApiResponse<Ingredient> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to create ingredient")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function updateIngredient(
  id: string,
  ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">,
): Promise<Ingredient> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredientData),
  })

  const result: ApiResponse<Ingredient> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to update ingredient")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function deleteIngredient(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })

  const result: ApiResponse<void> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to delete ingredient")
  }
}
