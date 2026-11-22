import mongoose from 'mongoose'

/**
 * Sanitizes MongoDB connection URIs to prevent credential leakage in logs
 * @param {string} uri
 * @returns {string}
 */
export function sanitizeMongoUri(uri) {
  if (!uri) return ''
  return uri.replace(/:\/\/([^:]+):([^@]+)@/g, '://$1:****@')
}

/**
 * Initializes and awaits MongoDB connection via Mongoose using process.env.DATABASE_URL
 * Ensures the connection completes before returning.
 * @returns {Promise<typeof mongoose>}
 */
export async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined in backend/.env')
  }

  if (DATABASE_URL.includes('<db_password>')) {
    throw new Error(
      "DATABASE_URL contains the placeholder '<db_password>'. Please replace it with your MongoDB Atlas database user password in backend/.env"
    )
  }

  // Reuse existing active connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  // Connection event listeners for safe diagnostics
  mongoose.connection.on('error', (err) => {
    const safeError = sanitizeMongoUri(err?.message || String(err))
    console.error('Mongoose connection error:', safeError)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected from MongoDB')
  })

  try {
    const connection = await mongoose.connect(DATABASE_URL)
    const host = mongoose.connection.host || 'unknown-host'
    const dbName = mongoose.connection.name || 'default'
    console.info(`Successfully connected to database [host: ${host}, db: ${dbName}]`)
    return connection
  } catch (err) {
    const safeMessage = sanitizeMongoUri(err?.message || String(err))
    throw new Error(`Database connection failed: ${safeMessage}`)
  }
}
