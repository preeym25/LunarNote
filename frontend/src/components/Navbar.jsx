import PropTypes from 'prop-types'
import { LogoIcon, MoonIcon, PlusIcon, SearchIcon, SunIcon } from './Icons.jsx'

export function Navbar({
  onNewStory,
  theme,
  onToggleTheme,
  searchValue,
  onSearchChange,
  onNavigateHome,
  onExplore,
  onOpenCategories,
  onOpenAbout,
}) {
  return (
    <header className="navbar-root">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={onNavigateHome} role="button" tabIndex={0}>
          <div className="navbar-logo-badge">
            <LogoIcon size={18} className="icon-logo" />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">LUNARNOTE</span>
            <span className="navbar-tagline">Celestial Journal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-nav-links" aria-label="Main Navigation">
          <button type="button" className="nav-link-btn" onClick={onExplore}>
            Explore
          </button>
          <button type="button" className="nav-link-btn" onClick={onOpenCategories}>
            Categories
          </button>
          <button type="button" className="nav-link-btn" onClick={onOpenAbout}>
            About
          </button>
        </nav>

        {/* Global Search Bar */}
        <div className="navbar-search">
          <SearchIcon size={16} className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search stories, authors, tags..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              className="navbar-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Theme / Ambience Switcher */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>

          {/* New Story Primary Action */}
          <button
            type="button"
            className="btn-primary-write"
            onClick={onNewStory}
          >
            <PlusIcon size={16} />
            <span>Write Story</span>
          </button>
        </div>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  onNewStory: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onNavigateHome: PropTypes.func.isRequired,
  onExplore: PropTypes.func.isRequired,
  onOpenCategories: PropTypes.func.isRequired,
  onOpenAbout: PropTypes.func.isRequired,
}
