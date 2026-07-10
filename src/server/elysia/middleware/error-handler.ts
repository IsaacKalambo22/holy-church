import { Elysia } from 'elysia'

// Pull useful info out of a Prisma known-request error without importing the
// Prisma runtime type. Returns null for anything that isn't a Prisma error.
function prismaError(error: unknown): { code: string; fields: string[] } | null {
  if (error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
    const code = (error as { code: string }).code
    if (!/^P\d/.test(code)) return null
    const meta = (error as { meta?: { target?: unknown } }).meta
    const target = meta?.target
    const fields = Array.isArray(target) ? target.map(String) : typeof target === 'string' ? [target] : []
    return { code, fields }
  }
  return null
}

export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error)

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    // Map common Prisma errors to friendly, actionable responses. This covers
    // every route since all handlers throw through this single error handler.
    const pErr = prismaError(error)
    if (pErr) {
      switch (pErr.code) {
        case 'P2002': {
          // Unique constraint — e.g. a duplicate slug.
          const field = pErr.fields.find((f) => f !== 'deletedAt') || pErr.fields[0]
          set.status = 409
          return {
            success: false,
            error: field
              ? `A record with this ${field} already exists. Please use a different ${field}.`
              : 'A record with these details already exists.',
          }
        }
        case 'P2025':
          set.status = 404
          return { success: false, error: 'The requested record no longer exists.' }
        case 'P2003':
          set.status = 400
          return { success: false, error: 'A referenced record is missing or invalid.' }
      }
    }

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
