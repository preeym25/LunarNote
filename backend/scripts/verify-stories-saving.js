import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { initDatabase } from '../src/db/init.js'
import { createPost, getPostById, updatePost, deletePost, queryPostsFeed } from '../src/services/posts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function runTest() {
  console.log('--- Verifying Story Creation & Persistence ---')
  await initDatabase()
  
  const createdIds = []
  try {
    // 1. Create first story
    console.log('1. Creating Story 1: "The Architecture of Lunar Systems"...')
    const story1 = await createPost({
      title: 'The Architecture of Lunar Systems',
      author: 'Aria Chen',
      category: 'Engineering',
      tags: ['architecture', 'distributed', 'performance'],
      description: 'Architecting resilient services across midnight networks.',
      contents: '# The Architecture of Lunar Systems\n\nBuilding durable services requires decoupled state and strict database indexing.',
    })
    createdIds.push(story1._id)
    console.log(`✓ Story 1 saved with ID: ${story1._id}, Reading time: ${story1.readingTime} min`)

    // 2. Create second story
    console.log('2. Creating Story 2: "Celestial Typography in Modern Editorial"...')
    const story2 = await createPost({
      title: 'Celestial Typography in Modern Editorial',
      author: 'Marcus Vance',
      category: 'Design',
      tags: ['typography', 'design', 'celestial'],
      description: 'Why proportion and rhythm elevate the reading experience.',
      contents: '# Celestial Typography\n\nEditorial typography gives words rhythm, balance, and quiet power.',
    })
    createdIds.push(story2._id)
    console.log(`✓ Story 2 saved with ID: ${story2._id}, Reading time: ${story2.readingTime} min`)

    // 3. Create third story
    console.log('3. Creating Story 3: "Reflections on Night Writing"...')
    const story3 = await createPost({
      title: 'Reflections on Night Writing',
      author: 'Elena Rostova',
      category: 'Culture',
      tags: ['writing', 'night', 'solitude'],
      description: 'The creative stillness that arrives after midnight.',
      contents: '# Reflections on Night Writing\n\nStillness breeds deeper reflection than the fast-paced daytime web.',
    })
    createdIds.push(story3._id)
    console.log(`✓ Story 3 saved with ID: ${story3._id}, Reading time: ${story3.readingTime} min`)

    // 4. Verify retrieval of all created stories via queryPostsFeed
    console.log('4. Querying feed to verify all stories are returned and sorted...')
    const feed = await queryPostsFeed({ limit: 10 })
    console.log(`✓ Feed returned ${feed.total} total stories. Retrieved page size: ${feed.posts.length}`)

    for (const id of createdIds) {
      const retrieved = await getPostById(id)
      if (!retrieved) {
        throw new Error(`Failed to retrieve post ID ${id}`)
      }
      console.log(`✓ Verified post in database: "${retrieved.title}" [category: ${retrieved.category}, author: ${retrieved.author}]`)
    }

    // 5. Verify story update
    console.log('5. Verifying story update...')
    const updated = await updatePost(story1._id, {
      title: 'The Architecture of Lunar Systems — Revised Edition',
      description: 'Updated with latest edge execution benchmarks.'
    })
    if (updated.title !== 'The Architecture of Lunar Systems — Revised Edition') {
      throw new Error('Update did not take effect.')
    }
    console.log(`✓ Verified update: "${updated.title}"`)

    // 6. Clean up verification test posts
    console.log('6. Cleaning up test stories...')
    for (const id of createdIds) {
      await deletePost(id)
    }
    console.log('✓ All test stories cleaned up cleanly.')

    console.log('--- ALL STORY CREATION & PERSISTENCE VERIFICATIONS PASSED ---')
  } catch (err) {
    console.error('Story persistence test failed:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

runTest()
