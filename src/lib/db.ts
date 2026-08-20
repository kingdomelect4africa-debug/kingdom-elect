import { PrismaClient } from '@prisma/client'

// Neon's serverless Postgres suspends its compute after a period of
// inactivity; the first query after a suspend intermittently fails with a
// connection error while the compute resumes. Retrying transient connection
// errors here (rather than only working around it in manual testing) means
// real visitors hitting a "cold" database don't see a 500.
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017'])

function createClient() {
  const base = new PrismaClient()
  return base.$extends({
    query: {
      $allOperations: async ({ query, args }) => {
        const maxAttempts = 6
        let lastError: unknown
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            return await query(args)
          } catch (error) {
            lastError = error
            const code = (error as { code?: string } | null)?.code
            if (!code || !RETRYABLE_CODES.has(code) || attempt === maxAttempts - 1) throw error
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
          }
        }
        throw lastError
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> }

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
