import PropTypes from 'prop-types'
import { CheckIcon, XIcon } from './Icons.jsx'

export function Toast({ toast, onClose }) {
  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div className={`toast-root ${isError ? 'toast-error' : 'toast-success'}`} role="status">
      <div className="toast-icon">
        {isError ? <XIcon className="icon-toast" /> : <CheckIcon className="icon-toast" />}
      </div>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
      </div>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss toast">
        <XIcon className="icon-toast-close" />
      </button>
    </div>
  )
}

Toast.propTypes = {
  toast: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }),
  onClose: PropTypes.func.isRequired,
}
