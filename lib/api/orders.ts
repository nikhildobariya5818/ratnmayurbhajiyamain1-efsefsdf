import type { Order, ApiResponse } from "@/lib/types"

const API_BASE = "/api/orders"

export async function fetchOrders(
  searchTerm?: string,
  clientId?: string,
  startDate?: string,
  endDate?: string,
  populate = false,
): Promise<Order[]> {
  const params = new URLSearchParams()
  if (searchTerm) params.append("search", searchTerm)
  if (clientId) params.append("clientId", clientId)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (populate) params.append("populate", "true")

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE

  const response = await fetch(url)
  const result: ApiResponse<Order[]> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch orders")
  }

  return result.data || []
}

export async function fetchOrder(id: string, populate = false): Promise<Order> {
  const params = new URLSearchParams()
  if (populate) params.append("populate", "true")

  const url = params.toString() ? `${API_BASE}/${id}?${params.toString()}` : `${API_BASE}/${id}`

  const response = await fetch(url)
  const result: ApiResponse<Order> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch order")
  }

  if (!result.data) {
    throw new Error("Order not found")
  }

  return result.data
}

export async function createOrder(orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">): Promise<Order> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  const result: ApiResponse<Order> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to create order")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function updateOrder(
  id: string,
  orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">,
): Promise<Order> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  const result: ApiResponse<Order> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to update order")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function deleteOrder(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })

  const result: ApiResponse<void> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to delete order")
  }
}
