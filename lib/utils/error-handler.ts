export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unexpected error occurred"
}

export function createApiError(response: Response, message?: string): ApiError {
  const defaultMessage = `Request failed with status ${response.status}`
  return new ApiError(message || defaultMessage, response.status, response.statusText)
}
