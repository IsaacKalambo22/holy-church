import { Elysia } from 'elysia'

export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error)

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    switch (code) {
      case 'VALIDATION':
        set.status = 400
        return {
          success: false,
          error: 'Validation failed',
          details: errorMessage,
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          success: false,
          error: 'Resource not found',
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          success: false,
          error: 'Internal server error',
        }
      default:
        set.status = 500
        return {
          success: false,
          error: errorMessage,
        }
    }
  })
