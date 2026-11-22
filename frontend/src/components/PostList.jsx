import PropTypes from 'prop-types'
import { ArrowLeftIcon, ArrowRightIcon, BookOpenIcon } from './Icons.jsx'
import { PostCard } from './PostCard.jsx'
import { SkeletonCard } from './SkeletonCard.jsx'

export function PostList({
  posts = [],
  isLoading = false,
  isError = false,
  error = null,
  layout = 'grid',
  onReadPost,
  onEditPost,
  onDeletePost,
  onResetFilters,
  onNewStory,
  page = 1,
  totalPages = 1,
  onPageChange,
  total = 0,
  hasActiveFilters = false,
}) {
  if (isLoading) {
    return (
      <div className={`post-list-grid post-list-${layout}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} layout={layout} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="feed-status-card feed-error-card">
        <div className="status-icon">⚠️</div>
        <h3>Failed to load stories</h3>
        <p>{error?.message || 'There was an issue connecting to the database.'}</p>
        <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="feed-status-card feed-empty-card">
        <div className="status-icon">
          <BookOpenIcon className="icon-empty" />
        </div>
        <h3>{hasActiveFilters ? 'No matching stories' : 'No stories found'}</h3>
        <p>
          {hasActiveFilters
            ? 'No published articles match your current search criteria or category filter.'
            : 'Your thoughts deserve their own universe. Begin by writing your story.'}
        </p>
        <div className="empty-actions">
          {hasActiveFilters && onResetFilters && (
            <button type="button" className="btn-secondary" onClick={onResetFilters}>
              Clear Filters
            </button>
          )}
          {onNewStory && (
            <button type="button" className="btn-primary" onClick={onNewStory}>
              Write Story
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="post-list-root">
      {/* Posts Grid / List */}
      <div className={`post-list-grid post-list-${layout}`}>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            layout={layout}
            onRead={onReadPost}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-root">
          <div className="pagination-info">
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total stories)
          </div>

          <div className="pagination-buttons">
            <button
              type="button"
              className="btn-pagination"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              <ArrowLeftIcon className="icon-pagination" />
              <span>Previous</span>
            </button>

            <div className="pagination-pages">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`btn-page-number ${page === pageNumber ? 'active' : ''}`}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className="btn-pagination"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              <span>Next</span>
              <ArrowRightIcon className="icon-pagination" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  layout: PropTypes.oneOf(['grid', 'list']),
  onReadPost: PropTypes.func.isRequired,
  onEditPost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func,
  onNewStory: PropTypes.func,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  total: PropTypes.number,
  hasActiveFilters: PropTypes.bool,
}
