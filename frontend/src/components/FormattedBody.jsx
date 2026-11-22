import PropTypes from 'prop-types'

/**
 * Checks if a string is a standalone image URL or markdown image
 */
function isImageBlock(text) {
  const trimmed = text.trim()
  // Markdown image syntax: ![alt](url)
  const mdMatch = trimmed.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/)
  if (mdMatch) {
    return { isImage: true, alt: mdMatch[1], url: mdMatch[2] }
  }

  // Bare image URL on its own line (e.g. ending in jpg, png, webp, gif, svg or from unsplash/cloudinary/imgur)
  const isBareUrl =
    /^https?:\/\/[^\s]+$/.test(trimmed) &&
    (/\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i.test(trimmed) ||
      trimmed.includes('images.unsplash.com') ||
      trimmed.includes('cloudinary.com') ||
      trimmed.includes('imgur.com') ||
      trimmed.includes('cdn.'))

  if (isBareUrl) {
    return { isImage: true, alt: '', url: trimmed }
  }

  return { isImage: false }
}

/**
 * Safe inline formatter for links, bold, italic, code, and inline images
 */
function renderInlineContent(text) {
  if (!text) return null

  // Regex pattern matching:
  // 1. Markdown image: !\[(.*?)\]\((https?:\/\/[^\s)]+)\)
  // 2. Markdown link: \[(.*?)\]\((https?:\/\/[^\s)]+)\)
  // 3. Bold: \*\*(.*?)\*\*
  // 4. Inline code: `(.*?)`
  // 5. Italic: \*(.*?)\*
  const pattern = /(!\[(.*?)\]\((https?:\/\/[^\s)]+)\))|(\[(.*?)\]\((https?:\/\/[^\s)]+)\))|(\*\*(.*?)\*\*)|(`(.*?)`)|(\*(.*?)\*)/g

  const elements = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // Inline image: ![alt](url)
      const alt = match[2]
      const url = match[3]
      elements.push(
        <span key={match.index} className="reader-inline-img-wrap">
          <img
            src={url}
            alt={alt || 'Illustration'}
            className="reader-inline-image"
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          {alt && <span className="reader-figcaption">{alt}</span>}
        </span>
      )
    } else if (match[4]) {
      // Link: [text](url)
      const linkText = match[5]
      const linkUrl = match[6]
      elements.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="reader-link"
        >
          {linkText}
        </a>
      )
    } else if (match[7]) {
      // Bold: **text**
      elements.push(<strong key={match.index}>{match[8]}</strong>)
    } else if (match[9]) {
      // Code: `text`
      elements.push(<code key={match.index} className="reader-code-inline">{match[10]}</code>)
    } else if (match[11]) {
      // Italic: *text*
      elements.push(<em key={match.index}>{match[12]}</em>)
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex))
  }

  return elements.length > 0 ? elements : text
}

export function FormattedBody({ content = '' }) {
  if (!content) return <p className="reader-paragraph-empty">No content provided.</p>

  // Split into blocks by double newlines
  const blocks = content.split(/\n\s*\n/)

  return (
    <div className="reader-body-content">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // 1. Check for Image Block
        const imageInfo = isImageBlock(trimmed)
        if (imageInfo.isImage) {
          return (
            <figure key={idx} className="reader-figure">
              <img
                src={imageInfo.url}
                alt={imageInfo.alt || 'Story illustration'}
                className="reader-inline-image"
                loading="lazy"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.alt = 'Image could not be loaded'
                  e.currentTarget.style.opacity = '0.5'
                }}
              />
              {imageInfo.alt && (
                <figcaption className="reader-figcaption">{imageInfo.alt}</figcaption>
              )}
            </figure>
          )
        }

        // 2. Headings
        if (trimmed.startsWith('# ')) {
          return <h2 key={idx} className="reader-h1">{trimmed.replace(/^#\s+/, '')}</h2>
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={idx} className="reader-h2">{trimmed.replace(/^##\s+/, '')}</h3>
        }
        if (trimmed.startsWith('### ')) {
          return <h4 key={idx} className="reader-h3">{trimmed.replace(/^###\s+/, '')}</h4>
        }

        // 3. Blockquote
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '')
          return (
            <blockquote key={idx} className="reader-blockquote">
              <p>{renderInlineContent(quoteText)}</p>
            </blockquote>
          )
        }

        // 4. Code block
        if (trimmed.startsWith('```')) {
          const code = trimmed.replace(/^```[a-z]*\n?|```$/gi, '')
          return (
            <pre key={idx} className="reader-pre">
              <code>{code}</code>
            </pre>
          )
        }

        // 5. Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(Boolean)
          return (
            <ul key={idx} className="reader-ul">
              {items.map((item, i) => (
                <li key={i}>{renderInlineContent(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          )
        }

        // 6. Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(Boolean)
          return (
            <ol key={idx} className="reader-ol">
              {items.map((item, i) => (
                <li key={i}>{renderInlineContent(item.replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          )
        }

        // 7. Standard paragraph (supports inline images, links, bold, code)
        return (
          <p key={idx} className="reader-paragraph">
            {renderInlineContent(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

FormattedBody.propTypes = {
  content: PropTypes.string,
}
