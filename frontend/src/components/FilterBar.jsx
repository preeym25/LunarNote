import PropTypes from 'prop-types'
import { GridIcon, ListIcon, XIcon } from './Icons.jsx'

export function FilterBar({
  authors = [],
  selectedAuthor = '',
  onSelectAuthor,
  sortBy = 'createdAt',
  onSortByChange,
  sortOrder = 'descending',
  onSortOrderChange,
  layout = 'grid',
  onLayoutChange,
  activeCategory = '',
  onClearCategory,
  searchQuery = '',
  onClearSearch,
  onResetAll,
}) {
  const hasActiveFilters = Boolean(searchQuery || selectedAuthor || activeCategory)

  return (
    <div className="filter-bar-root">
      <div className="filter-bar-controls">
        {/* Author Selector */}
        <div className="filter-group">
          <label htmlFor="filter-author" className="filter-label">Author:</label>
          <select
            id="filter-author"
            className="filter-select"
            value={selectedAuthor}
            onChange={(e) => onSelectAuthor(e.target.value)}
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Field Selector */}
        <div className="filter-group">
          <label htmlFor="filter-sort" className="filter-label">Sort:</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="createdAt">Publication Date</option>
            <option value="updatedAt">Last Updated</option>
            <option value="title">Title (A-Z)</option>
            <option value="readingTime">Reading Time</option>
          </select>

          {/* Sort Direction Toggle */}
          <select
            className="filter-select filter-order-select"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            aria-label="Sort direction"
          >
            <option value="descending">Newest / Desc</option>
            <option value="ascending">Oldest / Asc</option>
          </select>
        </div>

        {/* Layout Mode (Grid / List) */}
        <div className="layout-toggle-group">
          <button
            type="button"
            className={`btn-layout-toggle ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => onLayoutChange('grid')}
            title="Grid view"
            aria-label="Grid layout"
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={`btn-layout-toggle ${layout === 'list' ? 'active' : ''}`}
            onClick={() => onLayoutChange('list')}
            title="List view"
            aria-label="List layout"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <span className="active-filters-label">Active filters:</span>

          {searchQuery && (
            <span className="filter-chip">
              Search: &ldquo;{searchQuery}&rdquo;
              <button type="button" onClick={onClearSearch} aria-label="Remove search filter">
                <XIcon className="chip-x" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="filter-chip">
              Category: {activeCategory}
              <button type="button" onClick={onClearCategory} aria-label="Remove category filter">
                <XIcon className="chip-x" />
              </button>
            </span>
          )}

          {selectedAuthor && (
            <span className="filter-chip">
              Author: {selectedAuthor}
              <button type="button" onClick={() => onSelectAuthor('')} aria-label="Remove author filter">
                <XIcon className="chip-x" />
              </button>
            </span>
          )}

          <button type="button" className="btn-clear-all" onClick={onResetAll}>
            Reset All
          </button>
        </div>
      )}
    </div>
  )
}

FilterBar.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.string),
  selectedAuthor: PropTypes.string,
  onSelectAuthor: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  onSortByChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string,
  onSortOrderChange: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(['grid', 'list']),
  onLayoutChange: PropTypes.func.isRequired,
  activeCategory: PropTypes.string,
  onClearCategory: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  onClearSearch: PropTypes.func.isRequired,
  onResetAll: PropTypes.func.isRequired,
}
