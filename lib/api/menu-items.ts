import type { MenuItem, ApiResponse } from "@/lib/types"

const API_BASE = "/api/menu-items"

export async function fetchMenuItems(
  searchTerm?: string,
  category?: string,
  type?: string,
  populate = false,
): Promise<MenuItem[]> {
  const params = new URLSearchParams()
  if (searchTerm) params.append("search", searchTerm)
  if (category) params.append("category", category)
  if (type) params.append("type", type)
  if (populate) params.append("populate", "true")

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE

  const response = await fetch(url)
  const result: ApiResponse<MenuItem[]> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch menu items")
  }

  return result.data || []
}

export async function fetchMenuItem(id: string, populate = false): Promise<MenuItem> {
  const params = new URLSearchParams()
  if (populate) params.append("populate", "true")

  const url = params.toString() ? `${API_BASE}/${id}?${params.toString()}` : `${API_BASE}/${id}`

  const response = await fetch(url)
  const result: ApiResponse<MenuItem> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch menu item")
  }

  if (!result.data) {
    throw new Error("Menu item not found")
  }

  return result.data
}

export async function createMenuItem(
  menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">,
): Promise<MenuItem> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItemData),
  })

  const result: ApiResponse<MenuItem> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to create menu item")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function updateMenuItem(
  id: string,
  menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">,
): Promise<MenuItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItemData),
  })

  const result: ApiResponse<MenuItem> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to update menu item")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function deleteMenuItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })

  const result: ApiResponse<void> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to delete menu item")
  }
}
