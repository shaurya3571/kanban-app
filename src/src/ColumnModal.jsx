import { useState } from 'react'

const COLORS = ['#7c6aff','#ff6a9c','#6affd4','#ffb347','#6aaeff','#ff9f6a']

export default function ColumnModal({ col, onSave, onClose }) {
  const [title, setTitle] = useState(col?.title || '')
  const [color, setColor] = useState(col?.color || COLORS[0])

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), color })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{col ? 'Edit Column' : 'New Column'}</h2>
        <div className="form-group">
          <label>Column Name *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Review, Blocked…" autoFocus />
        </div>
        <div className="form-group">
          <label>Color</label>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.25rem' }}>
            {COLORS.map(c => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width:28, height:28, borderRadius:'50%', background:c, cursor:'pointer',
                  border: color === c ? '3px solid white' : '3px solid transparent',
                  outline: color === c ? `2px solid ${c}` : 'none',
                  transition:'all 0.15s'
                }}
              />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {col ? 'Save' : 'Create Column'}
          </button>
        </div>
      </div>
    </div>
  )
}