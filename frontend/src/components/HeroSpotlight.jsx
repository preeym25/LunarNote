import PropTypes from 'prop-types'
import { ArrowRightIcon, ClockIcon } from './Icons.jsx'

export function HeroSpotlight({ post, onReadPost }) {
  if (!post) return null

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const defaultCover =
    post.coverImage ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'

  return (
    <section className="hero-spotlight-root">
      <div className="hero-spotlight-card" onClick={() => onReadPost(post._id)}>
        <div className="hero-spotlight-image-wrap">
          <img
            src={defaultCover}
            alt={post.title}
            className="hero-spotlight-image"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
            }}
          />
          <div className="hero-spotlight-badge">Featured Story</div>
        </div>

        <div className="hero-spotlight-content">
          <div className="hero-spotlight-meta">
            <span className="hero-category-tag">{post.category || 'General'}</span>
            <span className="meta-separator">•</span>
            <span className="hero-read-time">
              <ClockIcon className="meta-icon" />
              {post.readingTime || 1} min read
            </span>
          </div>

          <h2 className="hero-spotlight-title">{post.title}</h2>

          <p className="hero-spotlight-excerpt">
            {post.description || post.contents?.slice(0, 180) + '...'}
          </p>

          <div className="hero-spotlight-footer">
            <div className="hero-author-info">
              <div className="author-avatar">
                {(post.author || 'A').slice(0, 2).toUpperCase()}
              </div>
              <div className="author-details">
                <span className="author-name">{post.author || 'Anonymous'}</span>
                <span className="publish-date">{formattedDate}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-read-story"
              onClick={(e) => {
                e.stopPropagation()
                onReadPost(post._id)
              }}
            >
              <span>Read Story</span>
              <ArrowRightIcon className="icon-arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

HeroSpotlight.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    coverImage: PropTypes.string,
    readingTime: PropTypes.number,
    createdAt: PropTypes.string,
  }),
  onReadPost: PropTypes.func.isRequired,
}
