import { NextResponse } from 'next/server'

export class ApiResponse {
  // Success response
  static success(data: unknown, status = 200) {
    return NextResponse.json({ success: true, data }, { status })
  }

  // Error response
  static error(message: string, status = 400, details?: Record<string, unknown>) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        ...(details ? { details } : {}),
      },
      { status }
    )
  }

  // Unauthorized
  static unauthorized(message = 'Unauthorized') {
    return this.error(message, 401)
  }

  // Forbidden
  static forbidden(message = 'Forbidden') {
    return this.error(message, 403)
  }

  // Not found
  static notFound(message = 'Resource not found') {
    return this.error(message, 404)
  }

  // Validation error
  static validationError(message: string, errors?: Record<string, unknown>) {
    return this.error(message, 422, errors)
  }

  // Server error
  static serverError(message = 'Internal server error') {
    return this.error(message, 500)
  }

  // Insufficient credits
  static insufficientCredits(required: number, available: number) {
    return this.error(
      `Insufficient credits. Required: ${required}, Available: ${available}`,
      402,
      { required, available }
    )
  }
}
