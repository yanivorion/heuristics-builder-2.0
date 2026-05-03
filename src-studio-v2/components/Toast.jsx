import React from 'react'

function Toast({ toasts }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' && '✓'}
          {t.type === 'error' && '✕'}
          {t.type === 'info' && 'ℹ'}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

export default Toast
