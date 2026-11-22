import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    contents: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Helper to calculate reading time and description before saving
postSchema.pre('save', function () {
  if (this.contents) {
    const wordCount = this.contents.trim().split(/\s+/).filter(Boolean).length
    if (!this.readingTime || this.readingTime === 1) {
      this.readingTime = Math.max(1, Math.ceil(wordCount / 200))
    }
    if (!this.description) {
      // Auto-extract first 160 characters as summary if description is not set
      const cleanText = this.contents.replace(/[#*`>_\-[\]]/g, '').trim()
      this.description = cleanText.length > 160 ? cleanText.slice(0, 157) + '...' : cleanText
    }
  }
})

// Indexing for search, filtering, and sorting performance
postSchema.index({ title: 'text', contents: 'text', description: 'text', author: 'text' })
postSchema.index({ category: 1, createdAt: -1 })
postSchema.index({ author: 1 })
postSchema.index({ tags: 1 })

export const Post = mongoose.model('post', postSchema)
