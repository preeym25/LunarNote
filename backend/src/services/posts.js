import { Post } from '../db/models/post.js'

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function calculateReadingTime(contents) {
  if (!contents) return 1
  const wordCount = contents.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function extractExcerpt(contents) {
  if (!contents) return ''
  const cleanText = contents.replace(/[#*`>_\-[\]]/g, '').trim()
  return cleanText.length > 160 ? cleanText.slice(0, 157) + '...' : cleanText
}

export async function createPost(postData) {
  const data = { ...postData }
  if (data.contents && (!data.readingTime || data.readingTime === 1)) {
    data.readingTime = calculateReadingTime(data.contents)
  }
  if (data.contents && !data.description) {
    data.description = extractExcerpt(data.contents)
  }
  const post = new Post(data)
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const direction =
    sortOrder === 'ascending' || sortOrder === 'asc' || sortOrder === 1 ? 1 : -1
  return await Post.find(query).sort({ [sortBy]: direction })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function incrementPostViews(postId) {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    { returnDocument: 'after' },
  )
}

export async function updatePost(postId, updates) {
  const updatedData = { ...updates }
  if (updatedData.contents) {
    if (!updatedData.readingTime) {
      updatedData.readingTime = calculateReadingTime(updatedData.contents)
    }
    if (!updatedData.description) {
      updatedData.description = extractExcerpt(updatedData.contents)
    }
  }

  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: updatedData },
    { returnDocument: 'after' },
  )
}

export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}

/**
 * Advanced query service with text search, filtering, sorting, and pagination
 */
export async function queryPostsFeed({
  search = '',
  category = '',
  author = '',
  tag = '',
  sortBy = 'createdAt',
  sortOrder = 'descending',
  page = 1,
  limit = 10,
  featured,
} = {}) {
  const query = {}

  if (search && search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i')
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { contents: searchRegex },
      { author: searchRegex },
      { tags: searchRegex },
    ]
  }

  if (category && category.trim() && category.toLowerCase() !== 'all') {
    query.category = new RegExp(`^${escapeRegex(category.trim())}$`, 'i')
  }

  if (author && author.trim()) {
    query.author = new RegExp(`^${escapeRegex(author.trim())}$`, 'i')
  }

  if (tag && tag.trim()) {
    query.tags = tag.trim()
  }

  if (featured !== undefined && featured !== '') {
    query.featured = featured === true || featured === 'true'
  }

  const currentPage = Math.max(1, parseInt(page, 10) || 1)
  const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 10))
  const skip = (currentPage - 1) * itemsPerPage

  const direction =
    sortOrder === 'ascending' || sortOrder === 'asc' || sortOrder === 1 || sortOrder === '1'
      ? 1
      : -1

  const [posts, total] = await Promise.all([
    Post.find(query).sort({ [sortBy]: direction }).skip(skip).limit(itemsPerPage),
    Post.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / itemsPerPage) || 1

  return {
    posts,
    total,
    page: currentPage,
    totalPages,
    hasMore: currentPage < totalPages,
    limit: itemsPerPage,
  }
}

/**
 * Aggregates all categories with their post counts
 */
export async function getCategoriesWithCounts() {
  const results = await Post.aggregate([
    { $match: { category: { $exists: true, $ne: '' } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ])
  return results.map((r) => ({ name: r._id, count: r.count }))
}

/**
 * Aggregates all unique tags with post counts
 */
export async function getTagsWithCounts() {
  const results = await Post.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 25 },
  ])
  return results.map((r) => ({ name: r._id, count: r.count }))
}
