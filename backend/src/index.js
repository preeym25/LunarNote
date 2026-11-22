import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from './app.js'
import { initDatabase, sanitizeMongoUri } from './db/init.js'

// Ensure .env is reliably loaded from backend/.env regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config() // fallback to cwd .env if needed

try {
  // Ensure the database connection completes before starting the server
  await initDatabase()

  const PORT = process.env.PORT || 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.info(`Express server running on http://0.0.0.0:${PORT}`)
  })
} catch (err) {
  const safeMessage = sanitizeMongoUri(err?.message || String(err))
  console.error('Failed to connect to database before starting server:', safeMessage)
  process.exit(1)
}
