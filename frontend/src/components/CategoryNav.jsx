import PropTypes from 'prop-types'

export function CategoryNav({
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  totalPosts = 0,
}) {
  const defaultCategories = ['Engineering', 'Design', 'Technology', 'Culture', 'Tutorials']

  // Merge default categories with categories from the database
  const categoryNames = [
    'All',
    ...Array.from(
      new Set([
        ...categories.map((c) => c.name),
        ...defaultCategories,
      ]),
    ),
  ]

  const getCount = (name) => {
    if (name === 'All') return totalPosts
    const found = categories.find((c) => c.name.toLowerCase() === name.toLowerCase())
    return found ? found.count : null
  }

  return (
    <nav className="category-nav-root" aria-label="Article categories">
      <div className="category-nav-scroll">
        {categoryNames.map((cat) => {
          const isActive =
            (activeCategory === '' && cat === 'All') ||
            activeCategory.toLowerCase() === cat.toLowerCase()
          const count = getCount(cat)

          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? 'category-pill-active' : ''}`}
              onClick={() => onSelectCategory(cat === 'All' ? '' : cat)}
            >
              <span>{cat}</span>
              {count !== null && count !== undefined && count > 0 && (
                <span className="category-count">{count}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ),
  activeCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
  totalPosts: PropTypes.number,
}
