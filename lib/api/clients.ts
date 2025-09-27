import type { Client, ApiResponse } from "@/lib/types"

const API_BASE = "/api/clients"

export async function fetchClients(searchTerm?: string): Promise<Client[]> {
  const url = searchTerm ? `${API_BASE}?search=${encodeURIComponent(searchTerm)}` : API_BASE

  const response = await fetch(url)
  const result: ApiResponse<Client[]> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch clients")
  }

  return result.data || []
}

export async function fetchClient(id: string): Promise<Client> {
  const response = await fetch(`${API_BASE}/${id}`)
  const result: ApiResponse<Client> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch client")
  }

  if (!result.data) {
    throw new Error("Client not found")
  }

  return result.data
}

export async function createClient(clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">): Promise<Client> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  })

  const result: ApiResponse<Client> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to create client")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function updateClient(
  id: string,
  clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">,
): Promise<Client> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  })

  const result: ApiResponse<Client> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to update client")
  }

  if (!result.data) {
    throw new Error("No data returned from server")
  }

  return result.data
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })

  const result: ApiResponse<void> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to delete client")
  }
}
