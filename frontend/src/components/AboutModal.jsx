import PropTypes from 'prop-types'
import { LogoIcon, SparkleIcon, XIcon } from './Icons.jsx'

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container about-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dialog-title"
      >
        <div className="modal-header">
          <div className="about-brand-badge">
            <LogoIcon size={24} />
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Close">
            <XIcon />
          </button>
        </div>

        <div className="modal-body about-modal-body">
          <div className="about-tagline-chip">
            <SparkleIcon size={12} className="sparkle-cyan" />
            <span>Editorial Sanctuary</span>
          </div>

          <h2 id="about-dialog-title" className="about-modal-title">
            Your thoughts deserve their own universe.
          </h2>

          <p className="about-modal-text">
            <strong>LunarNote</strong> is an independent editorial publishing platform designed for
            calm contemplation, software architecture, design essays, and long-form writing.
          </p>

          <p className="about-modal-text">
            In an era of relentless algorithmic feeds, noisy dashboards, and digital friction,
            LunarNote offers a serene, star-lit space where ideas breathe and craft takes precedence.
          </p>

          <div className="about-principles-grid">
            <div className="principle-card">
              <h4>Calm by Design</h4>
              <p>Deep midnight palettes and restrained typography that soothe the eyes during long reading hours.</p>
            </div>
            <div className="principle-card">
              <h4>Editorial Quality</h4>
              <p>Designed around the timeless aesthetics of classic print journals and digital publications.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Return to Exploration
          </button>
        </div>
      </div>
    </div>
  )
}

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
