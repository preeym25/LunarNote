import PropTypes from 'prop-types'
import { TrashIcon, XIcon } from './Icons.jsx'

export function DeleteModal({ isOpen, postTitle, isDeleting, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-container delete-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="modal-header">
          <div className="delete-icon-wrap">
            <TrashIcon className="icon-delete-warn" />
          </div>
          <button type="button" className="btn-modal-close" onClick={onCancel} aria-label="Close">
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          <h3 id="delete-dialog-title" className="delete-dialog-title">Delete Story?</h3>
          <p className="delete-dialog-message">
            Are you sure you want to permanently delete <strong>&ldquo;{postTitle}&rdquo;</strong>?
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  )
}

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  postTitle: PropTypes.string,
  isDeleting: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
