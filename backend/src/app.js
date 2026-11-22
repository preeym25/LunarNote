import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { postsRoutes } from './routes/posts.js'

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Health check endpoints
const getHealthStatus = () => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }
  const dbState = mongoose.connection.readyState
  return {
    status: dbState === 1 ? 'ok' : 'degraded',
    uptime: process.uptime(),
    database: {
      status: readyStateMap[dbState] || 'unknown',
      readyState: dbState,
    },
    timestamp: new Date().toISOString(),
  }
}

app.get('/', (req, res) => {
  res.send('LunarNote Blog API is running')
})

app.get('/health', (req, res) => {
  res.json(getHealthStatus())
})

app.get('/api/v1/health', (req, res) => {
  res.json(getHealthStatus())
})

// Application routes
postsRoutes(app)

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Centralized Error Handling Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err)
  const status = err.status || 500
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error'

  res.status(status).json({ error: message })
})

export { app }
