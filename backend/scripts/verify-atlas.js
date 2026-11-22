import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { initDatabase } from '../src/db/init.js'
import { createPost, getPostById, deletePost } from '../src/services/posts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function verifyAtlas() {
  console.log('--- LunarNote MongoDB Atlas Verification ---')
  console.log('1. Checking environment configuration...')
  
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    console.error('FAILED: DATABASE_URL is not defined in backend/.env')
    process.exit(1)
  }

  if (rawUrl.includes('<db_password>')) {
    console.error("FAILED: DATABASE_URL still contains '<db_password>'. Please update backend/.env with your real password.")
    process.exit(1)
  }

  console.log('2. Connecting to MongoDB Atlas cluster...')
  try {
    await initDatabase()
    console.log(`Connected successfully. Host: ${mongoose.connection.host}, Database: ${mongoose.connection.name}`)

    console.log('3. Testing Post Creation in Atlas...')
    const testPayload = {
      title: 'Celestial Verification — Atlas Connection Test',
      author: 'LunarNote DevOps',
      category: 'Engineering',
      tags: ['atlas', 'mongodb', 'verification'],
      description: 'Automated live test post to confirm MongoDB Atlas read/write functionality.',
      contents: 'This post confirms that the LunarNote backend is successfully communicating with the MongoDB Atlas cloud cluster.'
    }

    const created = await createPost(testPayload)
    console.log(`Post created successfully with ID: ${created._id}`)

    console.log('4. Testing Post Retrieval from Atlas...')
    const retrieved = await getPostById(created._id)
    if (!retrieved || retrieved.title !== testPayload.title) {
      throw new Error('Retrieved post does not match created test payload.')
    }
    console.log(`Post retrieved successfully: "${retrieved.title}" by ${retrieved.author}`)

    console.log('5. Cleaning up verification test post...')
    await deletePost(created._id)
    console.log('Test post cleaned up cleanly.')

    console.log('--- ALL ATLAS VERIFICATIONS PASSED ---')
  } catch (err) {
    console.error('Atlas verification failed:', err.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

verifyAtlas()
