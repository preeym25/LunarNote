import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  getCategoriesWithCounts,
  getTagsWithCounts,
  queryPostsFeed,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'

describe('advanced blogging features', () => {
  beforeEach(async () => {
    await Post.deleteMany({})

    await createPost({
      title: 'Modern Architecture with React 19 and Node',
      contents: 'Exploring the latest concurrent features, server components, and performance patterns in React 19 and Express.',
      author: 'Elena Rostova',
      category: 'Engineering',
      tags: ['react', 'nodejs', 'architecture'],
    })

    await createPost({
      title: 'Designing for Readability: The Editorial Web',
      contents: 'Why typography, rhythm, and comfortable line lengths define modern editorial publications like Medium and Substack.',
      author: 'Marcus Vance',
      category: 'Design',
      tags: ['design', 'typography', 'ux'],
    })

    await createPost({
      title: 'Scalable Databases with MongoDB and Mongoose',
      contents: 'Indexing strategies, aggregation pipelines, and query optimization for high-throughput blogging platforms.',
      author: 'Elena Rostova',
      category: 'Engineering',
      tags: ['mongodb', 'database', 'backend'],
    })
  })

  test('should search posts by keyword across title, contents, or author', async () => {
    const result = await queryPostsFeed({ search: 'React 19' })
    expect(result.total).toBe(1)
    expect(result.posts[0].title).toContain('React 19')
  })

  test('should filter posts by category', async () => {
    const result = await queryPostsFeed({ category: 'Engineering' })
    expect(result.total).toBe(2)
    expect(result.posts.every((p) => p.category === 'Engineering')).toBe(true)
  })

  test('should paginate posts correctly', async () => {
    const resultPage1 = await queryPostsFeed({ page: 1, limit: 2 })
    expect(resultPage1.posts.length).toBe(2)
    expect(resultPage1.totalPages).toBe(2)
    expect(resultPage1.hasMore).toBe(true)

    const resultPage2 = await queryPostsFeed({ page: 2, limit: 2 })
    expect(resultPage2.posts.length).toBe(1)
    expect(resultPage2.hasMore).toBe(false)
  })

  test('should aggregate categories with correct post counts', async () => {
    const categories = await getCategoriesWithCounts()
    expect(categories).toEqual(
      expect.arrayContaining([
        { name: 'Engineering', count: 2 },
        { name: 'Design', count: 1 },
      ]),
    )
  })

  test('should aggregate unique tags with counts', async () => {
    const tags = await getTagsWithCounts()
    const reactTag = tags.find((t) => t.name === 'react')
    expect(reactTag).toBeDefined()
    expect(reactTag.count).toBe(1)
  })

  test('should automatically calculate reading time and excerpt if not provided', async () => {
    const longContent = Array(450).fill('word').join(' ')
    const post = await createPost({
      title: 'Long Editorial Essay',
      contents: longContent,
      author: 'Essayist',
    })
    expect(post.readingTime).toBe(3) // ~450 words / 200 = 2.25 -> 3 mins
    expect(post.description.length).toBeGreaterThan(50)
  })
})
