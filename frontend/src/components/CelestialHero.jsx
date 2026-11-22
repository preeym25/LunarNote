import PropTypes from 'prop-types'
import { ArrowRightIcon, ClockIcon, SearchIcon, SparkleIcon } from './Icons.jsx'

export function CelestialHero({
  featuredPost,
  onReadPost,
  onExplore,
  onWriteStory,
  searchValue = '',
  onSearchChange,
}) {
  const formattedDate = featuredPost?.createdAt
    ? new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <section className="celestial-hero-root">
      {/* Background Celestial Moon Image Backdrop */}
      <div className="celestial-sky-backdrop" aria-hidden="true">
        <img
          src="/celestial-moon.jpg"
          alt="Celestial full moon over starry night and blue clouds"
          className="celestial-hero-bg-image"
        />
        {/* Directional gradient overlay for optimal editorial legibility */}
        <div className="celestial-gradient-overlay" />
        {/* Soft bottom blend to page background */}
        <div className="celestial-gradient-bottom-fade" />
      </div>

      {/* Hero Content Container */}
      <div className="celestial-hero-content">
        <div className="celestial-badge">
          <SparkleIcon size={13} className="sparkle-cyan" />
          <span>LUNARNOTE EDITORIAL</span>
        </div>

        <h1 className="celestial-hero-title">
          Your thoughts deserve their own universe.
        </h1>

        <p className="celestial-hero-subtitle">
          A serene sanctuary for long-form essays, system architecture, and quiet reflections under the moonlight.
        </p>

        {/* Integrated Hero Search Bar */}
        <div className="celestial-hero-search">
          <SearchIcon size={16} className="hero-search-icon" />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search stories, authors, or topics..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              className="hero-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="celestial-hero-actions">
          <button type="button" className="btn-celestial-primary" onClick={onExplore}>
            <span>Explore Stories</span>
            <ArrowRightIcon size={14} className="icon-arrow" />
          </button>
          <button type="button" className="btn-celestial-secondary" onClick={onWriteStory}>
            <span>Write Story</span>
          </button>
        </div>

        {/* Featured Story Spotlight Card */}
        {featuredPost && (
          <div className="celestial-spotlight-card" onClick={() => onReadPost(featuredPost._id)}>
            <div className="spotlight-image-wrap">
              <img
                src={featuredPost.coverImage || '/celestial-moon.jpg'}
                alt={featuredPost.title}
                className="spotlight-image"
                onError={(e) => {
                  e.currentTarget.src = '/celestial-moon.jpg'
                }}
              />
              <div className="spotlight-badge">Featured Story</div>
            </div>

            <div className="spotlight-body">
              <div className="spotlight-meta">
                <span className="spotlight-category">{featuredPost.category || 'General'}</span>
                <span className="meta-dot">•</span>
                <span className="spotlight-readtime">
                  <ClockIcon size={12} className="meta-icon-mini" />
                  {featuredPost.readingTime || 1} min read
                </span>
                {formattedDate && (
                  <>
                    <span className="meta-dot">•</span>
                    <span>{formattedDate}</span>
                  </>
                )}
              </div>

              <h2 className="spotlight-title">{featuredPost.title}</h2>

              <p className="spotlight-excerpt">
                {featuredPost.description ||
                  (featuredPost.contents ? featuredPost.contents.slice(0, 160) + '...' : '')}
              </p>

              <div className="spotlight-footer">
                <div className="spotlight-author">
                  <div className="author-avatar-sm">
                    {(featuredPost.author || 'A').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="author-name-sm">{featuredPost.author || 'Anonymous'}</span>
                </div>

                <span className="spotlight-read-action">
                  <span>Read Article</span>
                  <ArrowRightIcon size={13} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

CelestialHero.propTypes = {
  featuredPost: PropTypes.shape({
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
  onExplore: PropTypes.func.isRequired,
  onWriteStory: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
}
