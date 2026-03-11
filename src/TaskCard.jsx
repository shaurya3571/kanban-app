import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }

export default function TaskCard({ task, onEdit, onDelete, overlay, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  const style = overlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      {...(overlay ? {} : { ...attributes, ...listeners })}
    >
      <div className="task-card-top">
        <div className="task-title">{task.title}</div>
        {!overlay && (
          <div className="task-actions">
            <button className="icon-btn" onPointerDown={e => e.stopPropagation()} onClick={onEdit} title="Edit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button className="icon-btn" onPointerDown={e => e.stopPropagation()} onClick={onDelete} title="Delete">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        )}
      </div>
      {task.description && <div className="task-desc">{task.description}</div>}
      {task.priority && (
        <div className="task-footer">
          <span className={`priority-badge priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      )}
    </div>
  )
}