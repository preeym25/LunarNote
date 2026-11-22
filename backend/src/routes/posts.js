import mongoose from 'mongoose'
import {
  createPost,
  deletePost,
  getCategoriesWithCounts,
  getPostById,
  getTagsWithCounts,
  incrementPostViews,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  queryPostsFeed,
  updatePost,
} from '../services/posts.js'

export function postsRoutes(app) {
  // Discovery: Categories and counts
  app.get('/api/v1/categories', async (req, res, next) => {
    try {
      const categories = await getCategoriesWithCounts()
      return res.json({ categories })
    } catch (err) {
      next(err)
    }
  })

  // Discovery: Tags and counts
  app.get('/api/v1/tags', async (req, res, next) => {
    try {
      const tags = await getTagsWithCounts()
      return res.json({ tags })
    } catch (err) {
      next(err)
    }
  })

  // List Posts with Search, Filter, Sort, and Pagination
  app.get('/api/v1/posts', async (req, res, next) => {
    const {
      sortBy = 'createdAt',
      sortOrder = 'descending',
      author,
      tag,
      category,
      search,
      page = 1,
      limit = 10,
      featured,
      format,
    } = req.query

    try {
      // Legacy simple array format if requested
      if (format === 'legacy' || format === 'array') {
        const options = { sortBy, sortOrder }
        if (author && tag) {
          return res.status(400).json({ error: 'query by either author or tag, not both' })
        } else if (author) {
          return res.json(await listPostsByAuthor(author, options))
        } else if (tag) {
          return res.json(await listPostsByTag(tag, options))
        } else {
          return res.json(await listAllPosts(options))
        }
      }

      // Modern paginated feed
      const feed = await queryPostsFeed({
        search,
        category,
        author,
        tag,
        sortBy,
        sortOrder,
        page,
        limit,
        featured,
      })

      return res.json(feed)
    } catch (err) {
      next(err)
    }
  })

  // Get Single Post by ID
  app.get('/api/v1/posts/:id', async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid post ID format' })
    }

    try {
      const post = await getPostById(id)
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Asynchronously track view count without blocking response
      incrementPostViews(id).catch((e) =>
        console.error('Failed to increment post views:', e.message),
      )

      return res.json(post)
    } catch (err) {
      next(err)
    }
  })

  // Create Post
  app.post('/api/v1/posts', async (req, res, next) => {
    const { title, contents, author, category, tags, coverImage, description } = req.body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    try {
      const post = await createPost({
        title: title.trim(),
        contents,
        author: author ? author.trim() : undefined,
        category: category ? category.trim() : undefined,
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        coverImage,
        description,
      })

      return res.status(201).json(post)
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
      }
      next(err)
    }
  })

  // Update Post (PATCH)
  app.patch('/api/v1/posts/:id', async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid post ID format' })
    }

    try {
      const updates = { ...req.body }
      if (typeof updates.tags === 'string') {
        updates.tags = updates.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      }

      const post = await updatePost(id, updates)
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      return res.json(post)
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
      }
      next(err)
    }
  })

  // Update Post (PUT)
  app.put('/api/v1/posts/:id', async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid post ID format' })
    }

    try {
      const post = await updatePost(id, req.body)
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      return res.json(post)
    } catch (err) {
      next(err)
    }
  })

  // Delete Post
  app.delete('/api/v1/posts/:id', async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid post ID format' })
    }

    try {
      const { deletedCount } = await deletePost(id)
      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Post not found' })
      }
      return res.status(200).json({ message: 'Post deleted successfully', deletedCount })
    } catch (err) {
      next(err)
    }
  })
}
