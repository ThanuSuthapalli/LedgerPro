import { loadEnvConfig } from '@next/env'
import * as path from 'path'

// Load environment variables from .env
loadEnvConfig(process.cwd())

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

export type Database = typeof db
