import { describe, expect, test, beforeAll, afterAll } from '@jest/globals'
import http from 'http'
import { app } from '../app.js'
import { Post } from '../db/models/post.js'

describe('API Route Integration Tests', () => {
  let server
  let baseUrl

  beforeAll((done) => {
    server = http.createServer(app)
    server.listen(0, () => {
      const { port } = server.address()
      baseUrl = `http://127.0.0.1:${port}`
      done()
    })
  })

  afterAll((done) => {
    server.close(done)
  })

  test('GET /health should return 200 OK and database status', async () => {
    const res = await fetch(`${baseUrl}/health`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('ok')
    expect(data.database.status).toBe('connected')
    expect(data.uptime).toBeDefined()
  })

  test('POST /api/v1/posts without title should return 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/v1/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Author' }),
    })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('title is required')
  })

  test('POST /api/v1/posts should create post and return 201 Created', async () => {
    const newPost = {
      title: 'Full Stack Integration Post',
      contents: 'This post is created via HTTP route test.',
      author: 'Tester',
      category: 'Engineering',
      tags: ['testing', 'jest'],
    }

    const res = await fetch(`${baseUrl}/api/v1/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })

    expect(res.status).toBe(201)
    const created = await res.json()
    expect(created._id).toBeDefined()
    expect(created.title).toBe(newPost.title)
    expect(created.readingTime).toBe(1)
  })

  test('GET /api/v1/posts should return paginated feed', async () => {
    const res = await fetch(`${baseUrl}/api/v1/posts?page=1&limit=5`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.posts).toBeDefined()
    expect(Array.isArray(data.posts)).toBe(true)
    expect(data.total).toBeGreaterThan(0)
    expect(data.page).toBe(1)
  })

  test('GET /api/v1/posts/:id with invalid ObjectId should return 400', async () => {
    const res = await fetch(`${baseUrl}/api/v1/posts/invalid-id-123`)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid post ID format')
  })

  test('GET /api/v1/posts/:id with non-existent ObjectId should return 404', async () => {
    const res = await fetch(`${baseUrl}/api/v1/posts/60c72b2f9b1d8b0015b6d999`)
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toContain('Post not found')
  })

  test('PATCH /api/v1/posts/:id should update post', async () => {
    const post = await Post.findOne()
    const res = await fetch(`${baseUrl}/api/v1/posts/${post._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title via Route' }),
    })

    expect(res.status).toBe(200)
    const updated = await res.json()
    expect(updated.title).toBe('Updated Title via Route')
  })

  test('DELETE /api/v1/posts/:id should delete post', async () => {
    const post = await Post.findOne()
    const res = await fetch(`${baseUrl}/api/v1/posts/${post._id}`, {
      method: 'DELETE',
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.deletedCount).toBe(1)
  })

  test('GET /api/v1/categories should return categories array', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.categories).toBeDefined()
    expect(Array.isArray(data.categories)).toBe(true)
  })
})
