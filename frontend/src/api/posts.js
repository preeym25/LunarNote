/**
 * Dynamically resolves the backend API endpoint:
 * - When running in production on a remote domain (Render, Vercel, Netlify, Cloud Run),
 *   it directs to the live Render backend: https://lunarnote-backend.onrender.com/api/v1
 * - Respects explicit remote VITE_BACKEND_URL build configurations
 * - Falls back to http://localhost:3000/api/v1 for local development
 */
const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    // Deployed production environment
    if (!isLocalhost) {
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl.replace(/\/+$/, '')
      }
      return 'https://lunarnote-backend.onrender.com/api/v1'
    }
  }

  // Local development
  return envUrl || 'http://localhost:3000/api/v1'
}

const BACKEND_URL = getBackendUrl()

/**
 * Fetch paginated, filtered, and searched posts
 */
export const getPosts = async (params = {}) => {
  const cleanParams = {}
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val
    }
  })

  const queryString = new URLSearchParams(cleanParams).toString()
  const url = queryString ? `${BACKEND_URL}/posts?${queryString}` : `${BACKEND_URL}/posts`

  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to fetch posts: ${res.statusText}`)
  }

  const data = await res.json()
  // Normalize response whether it's the paginated object or a legacy array
  if (Array.isArray(data)) {
    return {
      posts: data,
      total: data.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    }
  }

  return {
    posts: data.posts || [],
    total: data.total || 0,
    page: data.page || 1,
    totalPages: data.totalPages || 1,
    hasMore: data.hasMore || false,
    limit: data.limit || 10,
  }
}

/**
 * Fetch a single post by ID
 */
export const getPostById = async (id) => {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to fetch post: ${res.statusText}`)
  }
  return await res.json()
}

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  const res = await fetch(`${BACKEND_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to create post: ${res.statusText}`)
  }

  return await res.json()
}

/**
 * Update an existing post
 */
export const updatePost = async ({ id, ...postData }) => {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to update post: ${res.statusText}`)
  }

  return await res.json()
}

/**
 * Delete a post
 */
export const deletePost = async (id) => {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to delete post: ${res.statusText}`)
  }

  return await res.json().catch(() => ({ success: true }))
}

/**
 * Fetch categories with post counts
 */
export const getCategories = async () => {
  const res = await fetch(`${BACKEND_URL}/categories`)
  if (!res.ok) {
    return { categories: [] }
  }
  return await res.json()
}

/**
 * Fetch tags with post counts
 */
export const getTags = async () => {
  const res = await fetch(`${BACKEND_URL}/tags`)
  if (!res.ok) {
    return { tags: [] }
  }
  return await res.json()
}

/**
 * Check backend health
 */
export const getHealth = async () => {
  const res = await fetch(`${BACKEND_URL}/health`)
  if (!res.ok) {
    throw new Error('Backend health check failed')
  }
  return await res.json()
}
