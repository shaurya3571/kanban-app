import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask, onEditCol, onDeleteCol, activeTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className={`column ${isOver ? 'column-drop-active' : ''}`}>
      <div className="column-header">
        <div className="column-title-group">
          <div className="column-dot" style={{ background: column.color }} />
          <span className="column-title">{column.title}</span>
          <span className="column-count">{tasks.length}</span>
        </div>
        <div className="column-actions">
          <button className="icon-btn" title="Edit column" onClick={onEditCol}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="icon-btn" title="Delete column" onClick={onDeleteCol}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      <div className="column-body" ref={setNodeRef}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              isDragging={activeTask?.id === task.id}
            />
          ))}
        </SortableContext>
        <button className="add-task-btn" onClick={onAddTask}>+ Add task</button>
      </div>
    </div>
  )
}