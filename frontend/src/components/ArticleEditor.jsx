import PropTypes from 'prop-types'
import { useState } from 'react'
import { FormattedBody } from './FormattedBody.jsx'
import { ClockIcon, XIcon } from './Icons.jsx'

const PRESET_COVERS = [
  { label: 'Luminous Moon', url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Midnight Cosmos', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Celestial Clouds', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Deep Universe', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Night', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
]

const PRESET_CATEGORIES = [
  'Engineering',
  'Design',
  'Technology',
  'Culture',
  'Tutorials',
  'General',
]

export function ArticleEditor({
  isOpen,
  initialPost = null,
  isSubmitting = false,
  onSubmit,
  onClose,
}) {
  const isEditing = Boolean(initialPost?._id)

  const initialCat = initialPost?.category || 'Engineering'
  const isInitialCustom = Boolean(initialCat && !PRESET_CATEGORIES.includes(initialCat))

  const [title, setTitle] = useState(initialPost?.title || '')
  const [author, setAuthor] = useState(initialPost?.author || '')
  const [category, setCategory] = useState(isInitialCustom ? 'General' : initialCat)
  const [customCategory, setCustomCategory] = useState(isInitialCustom ? initialCat : '')
  const [isCustomCategory, setIsCustomCategory] = useState(isInitialCustom)
  const [description, setDescription] = useState(initialPost?.description || '')
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || '')
  const [coverError, setCoverError] = useState(false)
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : '',
  )
  const [contents, setContents] = useState(initialPost?.contents || '')
  const [activeTab, setActiveTab] = useState('write') // 'write' | 'preview'
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  // Calculate live statistics
  const wordCount = contents.trim() ? contents.trim().split(/\s+/).filter(Boolean).length : 0
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

  // Tags list preview
  const tagsList = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const displayCategory = (isCustomCategory ? customCategory.trim() : category) || 'General'

  const isLikelyWebpage = (url) => {
    if (!url) return false
    const trimmed = url.trim()
    if (/^https?:\/\//i.test(trimmed)) {
      const hasImageExt = /\.(jpeg|jpg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(trimmed)
      const isKnownImageHost =
        /(images\.unsplash\.com|cloudinary\.com|imgur\.com|media\.easemytrip\.com|encrypted-tbn0\.gstatic\.com|cdn\.)/i.test(
          trimmed,
        )
      if (!hasImageExt && !isKnownImageHost && trimmed.split('/').length > 3) {
        return true
      }
    }
    return false
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!title.trim()) {
      setValidationError('Article title is required.')
      return
    }

    const resolvedCategory = isCustomCategory
      ? customCategory.trim() || 'General'
      : category.trim() || 'General'

    setValidationError('')

    const postPayload = {
      title: title.trim(),
      author: author.trim() || 'Anonymous',
      category: resolvedCategory,
      description: description.trim(),
      coverImage: coverImage.trim(),
      tags: tagsList,
      contents,
      readingTime: estimatedReadTime,
    }

    if (isEditing) {
      onSubmit({ id: initialPost._id, ...postPayload })
    } else {
      onSubmit(postPayload)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container editor-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-dialog-title"
      >
        {/* Editor Header */}
        <div className="editor-modal-header">
          <div className="editor-header-left">
            <h3 id="editor-dialog-title" className="editor-modal-title">
              {isEditing ? 'Edit Story' : 'Draft New Story'}
            </h3>
            <span className="editor-meta-live">
              <ClockIcon className="icon-mini" />
              {estimatedReadTime} min read • {wordCount} words
            </span>
          </div>

          <div className="editor-tab-switcher">
            <button
              type="button"
              className={`btn-tab ${activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('write')}
            >
              Write
            </button>
            <button
              type="button"
              className={`btn-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button
              type="button"
              className="btn-modal-close"
              onClick={onClose}
              aria-label="Close editor"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Validation Banner */}
        {validationError && (
          <div className="editor-validation-banner">
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        {activeTab === 'write' ? (
          <form id="editor-form" onSubmit={handleSubmit} className="editor-form-scroll">
            {/* Title */}
            <div className="form-field-group">
              <label htmlFor="post-title" className="form-label">
                Title <span className="required-star">*</span>
              </label>
              <input
                id="post-title"
                type="text"
                className="form-input form-input-title"
                placeholder="Give your story an engaging title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (validationError) setValidationError('')
                }}
                maxLength={200}
                required
              />
              <div className="field-hint-row">
                <span className="field-hint">A clear, descriptive title works best.</span>
                <span className="field-char-count">{title.length} / 200</span>
              </div>
            </div>

            {/* Author and Category Grid */}
            <div className="form-grid-two">
              <div className="form-field-group">
                <label htmlFor="post-author" className="form-label">
                  Author Name
                </label>
                <input
                  id="post-author"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Daniel Bugl"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <div className="form-label-row">
                  <label htmlFor={isCustomCategory ? 'post-custom-category' : 'post-category'} className="form-label">
                    Category {isCustomCategory && <span className="category-mode-tag">(Custom)</span>}
                  </label>
                  <button
                    type="button"
                    className="btn-category-toggle"
                    onClick={() => {
                      if (isCustomCategory) {
                        setIsCustomCategory(false)
                      } else {
                        setIsCustomCategory(true)
                        if (!customCategory) {
                          setCustomCategory(category !== 'General' ? category : '')
                        }
                      }
                    }}
                  >
                    {isCustomCategory ? '← Choose from presets' : '+ Type custom category'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    id="post-custom-category"
                    type="text"
                    className="form-input"
                    placeholder="Type custom category (e.g. Astronomy, Philosophy, Poetry)..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    maxLength={50}
                    autoFocus
                  />
                ) : (
                  <select
                    id="post-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true)
                        if (!customCategory) {
                          setCustomCategory('')
                        }
                      } else {
                        setCategory(e.target.value)
                      }
                    }}
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Type custom category...</option>
                  </select>
                )}
              </div>
            </div>

            {/* Excerpt / Description */}
            <div className="form-field-group">
              <label htmlFor="post-description" className="form-label">
                Subtitle / Short Excerpt
              </label>
              <input
                id="post-description"
                type="text"
                className="form-input"
                placeholder="A one-sentence summary to entice readers (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={240}
              />
            </div>

            {/* Cover Image & Presets */}
            <div className="form-field-group">
              <label htmlFor="post-cover" className="form-label">
                Cover Image URL
              </label>
              <input
                id="post-cover"
                type="text"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value)
                  setCoverError(false)
                }}
              />

              <div className="cover-presets-row">
                <span className="presets-label">Quick presets:</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="btn-cover-preset"
                    onClick={() => {
                      setCoverImage(preset.url)
                      setCoverError(false)
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {coverImage.trim() && !coverError && (
                <div className="cover-preview-thumbnail">
                  <img
                    src={coverImage.trim()}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setCoverError(true)}
                  />
                </div>
              )}

              {coverImage.trim() && isLikelyWebpage(coverImage) && (
                <div className="cover-hint-notice">
                  <span>💡 Tip: This looks like a webpage URL rather than a direct image link. Right-click the image on that page and select <strong>&quot;Copy Image Address&quot;</strong> (ending in .jpg, .png, etc.).</span>
                </div>
              )}

              {coverImage.trim() && coverError && (
                <div className="cover-error-notice">
                  <span>⚠️ Unable to load image preview from this link. Make sure the URL points directly to an image (e.g. from Unsplash or ending in .jpg/.png).</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="form-field-group">
              <label htmlFor="post-tags" className="form-label">
                Tags (comma separated)
              </label>
              <input
                id="post-tags"
                type="text"
                className="form-input"
                placeholder="react, nodejs, architecture"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              {tagsList.length > 0 && (
                <div className="editor-tags-preview">
                  {tagsList.map((tag) => (
                    <span key={tag} className="post-tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="form-field-group">
              <div className="content-label-row">
                <label htmlFor="post-contents" className="form-label">
                  Article Content (Markdown supported)
                </label>
                <span className="markdown-hint">Supports # Heading, &gt; Quote, ``` Code, - List</span>
              </div>
              <textarea
                id="post-contents"
                className="form-textarea"
                rows={12}
                placeholder="Tell your story... Write your markdown or text here."
                value={contents}
                onChange={(e) => setContents(e.target.value)}
              />
            </div>
          </form>
        ) : (
          /* Live Preview Tab */
          <div className="editor-preview-scroll">
            <div className="preview-container">
              <span className="preview-category-badge">{displayCategory}</span>
              <h1 className="preview-title">{title || 'Untitled Story'}</h1>
              {description && <p className="preview-subtitle">{description}</p>}
              <div className="preview-meta">
                <span>By {author || 'Anonymous'}</span> • <span>{estimatedReadTime} min read</span>
              </div>
              {coverImage.trim() && (
                <div className="preview-cover-wrap">
                  <img
                    src={coverImage.trim()}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="preview-body">
                <FormattedBody content={contents} />
              </div>
            </div>
          </div>
        )}

        {/* Editor Footer Actions */}
        <div className="editor-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            form="editor-form"
            className="btn-primary"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting
              ? isEditing
                ? 'Updating...'
                : 'Publishing...'
              : isEditing
                ? 'Save Changes'
                : 'Publish Story'}
          </button>
        </div>
      </div>
    </div>
  )
}

ArticleEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  initialPost: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    contents: PropTypes.string,
  }),
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
