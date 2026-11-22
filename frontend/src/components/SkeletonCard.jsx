import PropTypes from 'prop-types'

export function SkeletonCard({ layout = 'grid' }) {
  return (
    <div className={`skeleton-card-root skeleton-${layout}`}>
      <div className="skeleton-image shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-meta shimmer" />
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-title-sub shimmer" />
        <div className="skeleton-line skeleton-excerpt shimmer" />
        <div className="skeleton-footer">
          <div className="skeleton-avatar shimmer" />
          <div className="skeleton-line skeleton-author shimmer" />
        </div>
      </div>
    </div>
  )
}

SkeletonCard.propTypes = {
  layout: PropTypes.oneOf(['grid', 'list']),
}
