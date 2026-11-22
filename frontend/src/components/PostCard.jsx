import PropTypes from 'prop-types'
import { ClockIcon, EditIcon, TrashIcon } from './Icons.jsx'

export function PostCard({ post, layout = 'grid', onRead, onEdit, onDelete }) {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const defaultCover =
    post.coverImage || '/celestial-card-cover.jpg'

  return (
    <article
      className={`post-card-root post-card-${layout}`}
      onClick={() => onRead(post._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onRead(post._id)
      }}
    >
      {/* Cover Image */}
      <div className="post-card-image-wrap">
        <img
          src={defaultCover}
          alt={post.title}
          className="post-card-image"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            e.currentTarget.src = '/celestial-card-cover.jpg'
          }}
        />
        <div className="post-card-badge">{post.category || 'General'}</div>
      </div>

      {/* Content */}
      <div className="post-card-content">
        <div className="post-card-meta">
          <span className="post-meta-author">{post.author || 'Anonymous'}</span>
          <span className="meta-separator">•</span>
          <span className="post-meta-date">{formattedDate}</span>
          <span className="meta-separator">•</span>
          <span className="post-meta-readtime">
            <ClockIcon className="meta-icon-mini" />
            {post.readingTime || 1} min
          </span>
        </div>

        <h3 className="post-card-title">{post.title}</h3>

        <p className="post-card-excerpt">
          {post.description || (post.contents ? post.contents.slice(0, 140) + '...' : '')}
        </p>

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="post-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Actions */}
        <div className="post-card-footer">
          <div className="post-author-chip">
            <div className="author-avatar-sm">
              {(post.author || 'A').slice(0, 2).toUpperCase()}
            </div>
            <span className="author-name-sm">{post.author || 'Anonymous'}</span>
          </div>

          <div className="post-card-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn-card-action btn-card-edit"
              onClick={() => onEdit(post)}
              title="Edit story"
              aria-label="Edit story"
            >
              <EditIcon className="icon-action" />
            </button>
            <button
              type="button"
              className="btn-card-action btn-card-delete"
              onClick={() => onDelete(post)}
              title="Delete story"
              aria-label="Delete story"
            >
              <TrashIcon className="icon-action" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

PostCard.propTypes = {
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
    createdAt: PropTypes.string,
  }).isRequired,
  layout: PropTypes.oneOf(['grid', 'list']),
  onRead: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
