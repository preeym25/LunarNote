import PropTypes from 'prop-types'
import {
  ArrowLeftIcon,
  ClockIcon,
  EditIcon,
  ShareIcon,
  TrashIcon,
} from './Icons.jsx'

/**
 * Lightweight safe markdown formatter
 */
function FormattedBody({ content = '' }) {
  if (!content) return <p className="reader-paragraph-empty">No content provided.</p>

  // Split into blocks by double newlines
  const blocks = content.split(/\n\s*\n/)

  return (
    <div className="reader-body-content">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()

        // H1
        if (trimmed.startsWith('# ')) {
          return <h2 key={idx} className="reader-h1">{trimmed.replace(/^#\s+/, '')}</h2>
        }
        // H2
        if (trimmed.startsWith('## ')) {
          return <h3 key={idx} className="reader-h2">{trimmed.replace(/^##\s+/, '')}</h3>
        }
        // H3
        if (trimmed.startsWith('### ')) {
          return <h4 key={idx} className="reader-h3">{trimmed.replace(/^###\s+/, '')}</h4>
        }
        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '')
          return (
            <blockquote key={idx} className="reader-blockquote">
              <p>{quoteText}</p>
            </blockquote>
          )
        }
        // Code block
        if (trimmed.startsWith('```')) {
          const code = trimmed.replace(/^```[a-z]*\n?|```$/gi, '')
          return (
            <pre key={idx} className="reader-pre">
              <code>{code}</code>
            </pre>
          )
        }
        // Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(Boolean)
          return (
            <ul key={idx} className="reader-ul">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^[-*]\s+/, '')}</li>
              ))}
            </ul>
          )
        }

        // Standard paragraph
        return (
          <p key={idx} className="reader-paragraph">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

FormattedBody.propTypes = {
  content: PropTypes.string,
}

export function ArticleReader({
  post,
  relatedPosts = [],
  onBack,
  onEdit,
  onDelete,
  onSelectPost,
  onShare,
}) {
  if (!post) return null

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const updatedDate =
    post.updatedAt && post.updatedAt !== post.createdAt
      ? new Date(post.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null

  const defaultCover =
    post.coverImage || '/celestial-moon.jpg'

  return (
    <article className="article-reader-root">
      {/* Top Navigation */}
      <div className="reader-top-nav">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeftIcon className="icon-back" />
          <span>Back to Stories</span>
        </button>

        <div className="reader-top-actions">
          <button
            type="button"
            className="btn-reader-action"
            onClick={() => onShare(post)}
            title="Copy share link"
          >
            <ShareIcon className="icon-action" />
            <span>Share</span>
          </button>
          <button
            type="button"
            className="btn-reader-action"
            onClick={() => onEdit(post)}
            title="Edit story"
          >
            <EditIcon className="icon-action" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn-reader-action btn-reader-delete"
            onClick={() => onDelete(post)}
            title="Delete story"
          >
            <TrashIcon className="icon-action" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="reader-header">
        <div className="reader-meta-bar">
          <span className="reader-category-pill">{post.category || 'General'}</span>
          <span className="meta-separator">•</span>
          <span className="reader-read-time">
            <ClockIcon className="meta-icon" />
            {post.readingTime || 1} min read
          </span>
          {post.views !== undefined && post.views > 0 && (
            <>
              <span className="meta-separator">•</span>
              <span className="reader-views">{post.views} views</span>
            </>
          )}
        </div>

        <h1 className="reader-title">{post.title}</h1>

        {post.description && (
          <p className="reader-lead-description">{post.description}</p>
        )}

        {/* Author Bio Bar */}
        <div className="reader-author-bar">
          <div className="reader-author-info">
            <div className="reader-avatar-lg">
              {(post.author || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div className="reader-author-meta">
              <span className="reader-author-name">{post.author || 'Anonymous'}</span>
              <span className="reader-pub-dates">
                Published on {formattedDate}
                {updatedDate && ` (Updated ${updatedDate})`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      <div className="reader-hero-image-wrap">
        <img
          src={defaultCover}
          alt={post.title}
          className="reader-hero-image"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80'
          }}
        />
      </div>

      {/* Main Formatted Content */}
      <div className="reader-body-container">
        <FormattedBody content={post.contents} />

        {/* Article Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="reader-tags-footer">
            <span className="tags-label">Tagged in:</span>
            <div className="reader-tags-list">
              {post.tags.map((tag) => (
                <span key={tag} className="reader-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Footer Card */}
        <div className="reader-author-card">
          <div className="author-card-avatar">
            {(post.author || 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className="author-card-details">
            <h4>Written by {post.author || 'Anonymous'}</h4>
            <p>
              Contributing writer at Lunar Note. Exploring software architecture, design systems, and modern web development.
            </p>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="reader-related-stories">
          <div className="related-header">
            <h3>Recommended Stories</h3>
            <span className="related-subtitle">More from Lunar Note</span>
          </div>

          <div className="related-grid">
            {relatedPosts.slice(0, 3).map((rel) => (
              <div
                key={rel._id}
                className="related-card"
                onClick={() => onSelectPost(rel._id)}
              >
                <div className="related-image-wrap">
                  <img
                    src={
                      rel.coverImage ||
                      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={rel.title}
                    className="related-image"
                  />
                </div>
                <div className="related-info">
                  <span className="related-category">{rel.category || 'General'}</span>
                  <h4 className="related-title">{rel.title}</h4>
                  <span className="related-author">By {rel.author || 'Anonymous'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

ArticleReader.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    coverImage: PropTypes.string,
    readingTime: PropTypes.number,
    views: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  relatedPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
      coverImage: PropTypes.string,
      author: PropTypes.string,
    }),
  ),
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelectPost: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
}
