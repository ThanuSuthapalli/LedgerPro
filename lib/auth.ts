import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const baseUrl =
  process.env.BETTER_AUTH_URL ||
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.V0_RUNTIME_URL || 'localhost:3000'}`

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: baseUrl,
  basePath: '/api/auth',
  trustedOrigins: [
    baseUrl,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.V0_RUNTIME_URL ? `https://${process.env.V0_RUNTIME_URL}` : '',
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
})
