import { useEffect, useMemo, useState } from 'react'
import { AboutModal } from './components/AboutModal.jsx'
import { ArticleEditor } from './components/ArticleEditor.jsx'
import { ArticleReader } from './components/ArticleReader.jsx'
import { CategoryNav } from './components/CategoryNav.jsx'
import { CelestialHero } from './components/CelestialHero.jsx'
import { DeleteModal } from './components/DeleteModal.jsx'
import { FilterBar } from './components/FilterBar.jsx'
import { LogoIcon, SparkleIcon } from './components/Icons.jsx'
import { Navbar } from './components/Navbar.jsx'
import { PostList } from './components/PostList.jsx'
import { Toast } from './components/Toast.jsx'
import {
  useCategories,
  useCreatePost,
  useDeletePost,
  usePost,
  usePosts,
  useUpdatePost,
} from './hooks/useBlog.js'

export function Blog() {
  // Theme state with localStorage persistence (defaults to dark celestial)
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem('lunarnote-theme') ||
      localStorage.getItem('chronicle-theme') ||
      'dark'
    )
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('lunarnote-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Active View: 'feed' | 'read'
  const [activeView, setActiveView] = useState('feed')
  const [selectedPostId, setSelectedPostId] = useState(null)

  // Modals & Navigation State
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deletingPost, setDeletingPost] = useState(null)
  const [toast, setToast] = useState(null)

  // Filtering & Pagination State
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const [page, setPage] = useState(1)
  const [layout, setLayout] = useState('grid')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Queries
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = usePosts({
    search,
    category,
    author: selectedAuthor,
    sortBy,
    sortOrder,
    page,
    limit: 9,
  })

  const { data: categoriesData } = useCategories()
  const { data: currentPost } = usePost(selectedPostId)

  // Mutations
  const createMutation = useCreatePost({
    onSuccess: (newPost) => {
      setIsEditorOpen(false)
      showToast('Story published to the cosmos!')
      setPage(1)
      if (newPost?._id) {
        setSelectedPostId(newPost._id)
        setActiveView('read')
      }
    },
    onError: (err) => {
      showToast(err.message || 'Failed to publish story', 'error')
    },
  })

  const updateMutation = useUpdatePost({
    onSuccess: () => {
      setIsEditorOpen(false)
      setEditingPost(null)
      showToast('Story updated successfully!')
    },
    onError: (err) => {
      showToast(err.message || 'Failed to update story', 'error')
    },
  })

  const deleteMutation = useDeletePost({
    onSuccess: () => {
      setDeletingPost(null)
      if (activeView === 'read') {
        setActiveView('feed')
        setSelectedPostId(null)
      }
      showToast('Story deleted permanently.')
    },
    onError: (err) => {
      showToast(err.message || 'Failed to delete story', 'error')
    },
  })

  const posts = useMemo(() => postsData?.posts || [], [postsData?.posts])
  const totalPosts = postsData?.total || 0
  const totalPages = postsData?.totalPages || 1

  // Extract unique authors for filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authorsSet = new Set()
    posts.forEach((p) => {
      if (p.author) authorsSet.add(p.author)
    })
    return Array.from(authorsSet)
  }, [posts])

  // Featured article (first post when on page 1 without filters)
  const isDefaultFeed = !search && !category && !selectedAuthor && page === 1
  const featuredPost = isDefaultFeed && posts.length > 0 ? posts[0] : null
  // Display all posts in the feed so stories are never hidden or missing from the grid
  const feedPosts = posts

  // Navigation handlers
  const handleReadPost = (id) => {
    setSelectedPostId(id)
    setActiveView('read')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToFeed = () => {
    setActiveView('feed')
    setSelectedPostId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExplore = () => {
    if (activeView === 'read') {
      setActiveView('feed')
    }
    const feedElement = document.getElementById('feed-section')
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleOpenCategories = () => {
    if (activeView === 'read') {
      setActiveView('feed')
    }
    const catElement = document.getElementById('category-section')
    if (catElement) {
      catElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOpenAbout = () => {
    setIsAboutOpen(true)
  }

  const handleOpenNewStory = () => {
    setEditingPost(null)
    setIsEditorOpen(true)
  }

  const handleOpenEditStory = (post) => {
    setEditingPost(post)
    setIsEditorOpen(true)
  }

  const handleOpenDelete = (post) => {
    setDeletingPost(post)
  }

  const handleConfirmDelete = () => {
    if (deletingPost?._id) {
      deleteMutation.mutate(deletingPost._id)
    }
  }

  const handleSharePost = (post) => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => showToast(`Share link copied: "${post.title}"`))
      .catch(() => showToast('Failed to copy link', 'error'))
  }

  const handleResetAllFilters = () => {
    setSearch('')
    setCategory('')
    setSelectedAuthor('')
    setSortBy('createdAt')
    setSortOrder('descending')
    setPage(1)
  }

  return (
    <div className="blog-app-wrapper">
      {/* Top Navbar */}
      <Navbar
        onNewStory={handleOpenNewStory}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
          if (activeView === 'read') setActiveView('feed')
        }}
        onNavigateHome={handleBackToFeed}
        onExplore={handleExplore}
        onOpenCategories={handleOpenCategories}
        onOpenAbout={handleOpenAbout}
      />

      {/* Main Container */}
      <main className="blog-main-container">
        {activeView === 'read' ? (
          /* Reader View */
          <ArticleReader
            post={currentPost || posts.find((p) => p._id === selectedPostId)}
            relatedPosts={posts.filter((p) => p._id !== selectedPostId)}
            onBack={handleBackToFeed}
            onEdit={handleOpenEditStory}
            onDelete={handleOpenDelete}
            onSelectPost={handleReadPost}
            onShare={handleSharePost}
          />
        ) : (
          /* Feed View */
          <>
            {/* Cinematic Celestial Hero Section */}
            <CelestialHero
              featuredPost={featuredPost}
              onReadPost={handleReadPost}
              onExplore={handleExplore}
              onWriteStory={handleOpenNewStory}
              searchValue={search}
              onSearchChange={(val) => {
                setSearch(val)
                setPage(1)
              }}
            />

            {/* Category Nav Tabs */}
            <div id="category-section">
              <CategoryNav
                categories={categoriesData?.categories || []}
                activeCategory={category}
                onSelectCategory={(cat) => {
                  setCategory(cat)
                  setPage(1)
                }}
                totalPosts={totalPosts}
              />
            </div>

            {/* Filter Controls Bar */}
            <div id="feed-section">
              <FilterBar
                authors={uniqueAuthors}
                selectedAuthor={selectedAuthor}
                onSelectAuthor={(auth) => {
                  setSelectedAuthor(auth)
                  setPage(1)
                }}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                layout={layout}
                onLayoutChange={setLayout}
                activeCategory={category}
                onClearCategory={() => setCategory('')}
                searchQuery={search}
                onClearSearch={() => setSearch('')}
                onResetAll={handleResetAllFilters}
              />
            </div>

            {/* Posts Grid / List */}
            <PostList
              posts={feedPosts}
              isLoading={isPostsLoading}
              isError={isPostsError}
              error={postsError}
              layout={layout}
              onReadPost={handleReadPost}
              onEditPost={handleOpenEditStory}
              onDeletePost={handleOpenDelete}
              onResetFilters={handleResetAllFilters}
              onNewStory={handleOpenNewStory}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              total={totalPosts}
              hasActiveFilters={Boolean(search || category || selectedAuthor)}
            />
          </>
        )}
      </main>

      {/* Article Editor Modal (Create & Edit) */}
      <ArticleEditor
        isOpen={isEditorOpen}
        initialPost={editingPost}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(payload) => {
          if (editingPost) {
            updateMutation.mutate(payload)
          } else {
            createMutation.mutate(payload)
          }
        }}
        onClose={() => {
          setIsEditorOpen(false)
          setEditingPost(null)
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingPost)}
        postTitle={deletingPost?.title}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingPost(null)}
      />

      {/* About LunarNote Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Editorial Footer */}
      <footer className="footer-root">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand" onClick={handleBackToFeed} role="button" tabIndex={0}>
              <div className="navbar-logo-badge">
                <LogoIcon size={18} className="icon-logo" />
              </div>
              <div className="footer-brand-text">
                <div className="footer-brand-title">LUNARNOTE</div>
                <div className="footer-brand-tagline">
                  Your thoughts deserve their own universe.
                </div>
              </div>
            </div>

            <nav className="footer-links" aria-label="Footer Navigation">
              <button type="button" className="footer-link-btn" onClick={handleExplore}>
                Explore
              </button>
              <button type="button" className="footer-link-btn" onClick={handleOpenCategories}>
                Categories
              </button>
              <button type="button" className="footer-link-btn" onClick={handleOpenAbout}>
                About
              </button>
              <button type="button" className="footer-link-btn" onClick={handleOpenNewStory}>
                Write Story
              </button>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} LunarNote Editorial Platform. All rights reserved.</span>
            <span className="footer-celestial-note">
              <SparkleIcon size={12} className="sparkle-cyan" />
              <span>Crafted for quiet reflections and enduring ideas.</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Blog
