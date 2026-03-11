import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './Column'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import ColumnModal from './ColumnModal'

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'Todo', color: '#7c6aff' },
  { id: 'inprogress', title: 'In Progress', color: '#ffb347' },
  { id: 'done', title: 'Done', color: '#6affd4' },
]

const DEFAULT_TASKS = [
  { id: uuidv4(), title: 'Design landing page', description: 'Create wireframes and mockups', columnId: 'todo', priority: 'high' },
  { id: uuidv4(), title: 'Setup project repo', description: 'Initialize Git and configure CI', columnId: 'inprogress', priority: 'medium' },
  { id: uuidv4(), title: 'Write README', description: '', columnId: 'done', priority: 'low' },
]

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}

export default function App() {
  const [theme, setTheme] = useState(() => load('kb_theme', 'dark'))
  const [columns, setColumns] = useState(() => load('kb_columns', DEFAULT_COLUMNS))
  const [tasks, setTasks] = useState(() => load('kb_tasks', DEFAULT_TASKS))
  const [search, setSearch] = useState('')
  const [activeTask, setActiveTask] = useState(null)
  const [taskModal, setTaskModal] = useState(null) // { mode: 'create'|'edit', columnId, task? }
  const [colModal, setColModal] = useState(false)
  const [editColId, setEditColId] = useState(null)

  useEffect(() => { localStorage.setItem('kb_theme', JSON.stringify(theme)) }, [theme])
  useEffect(() => { localStorage.setItem('kb_columns', JSON.stringify(columns)) }, [columns])
  useEffect(() => { localStorage.setItem('kb_tasks', JSON.stringify(tasks)) }, [tasks])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '')
  }, [theme])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragStart({ active }) {
    setActiveTask(tasks.find(t => t.id === active.id) || null)
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return
    const activeId = active.id
    const overId = over.id

    // dropped on a column
    const overCol = columns.find(c => c.id === overId)
    if (overCol) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, columnId: overId } : t))
      return
    }

    // dropped on a task
    const overTask = tasks.find(t => t.id === overId)
    if (!overTask) return
    if (overTask.columnId !== tasks.find(t => t.id === activeId)?.columnId) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, columnId: overTask.columnId } : t))
    } else {
      setTasks(prev => {
        const ids = prev.map(t => t.id)
        return arrayMove(prev, ids.indexOf(activeId), ids.indexOf(overId))
      })
    }
  }

  function saveTask(data) {
    if (taskModal.mode === 'create') {
      setTasks(prev => [...prev, { id: uuidv4(), columnId: taskModal.columnId, ...data }])
    } else {
      setTasks(prev => prev.map(t => t.id === taskModal.task.id ? { ...t, ...data } : t))
    }
    setTaskModal(null)
  }

  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)) }

  function saveColumn(data) {
    if (!editColId) {
      setColumns(prev => [...prev, { id: uuidv4(), ...data }])
    } else {
      setColumns(prev => prev.map(c => c.id === editColId ? { ...c, ...data } : c))
    }
    setColModal(false); setEditColId(null)
  }

  function deleteColumn(id) {
    setColumns(prev => prev.filter(c => c.id !== id))
    setTasks(prev => prev.filter(t => t.columnId !== id))
  }

  const filtered = search
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(search.toLowerCase())
      )
    : tasks

  return (
    <>
      <header className="header">
        <div className="logo">⬛ KanFlow</div>
        <div className="header-right">
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-ghost" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-primary" onClick={() => setTaskModal({ mode: 'create', columnId: columns[0]?.id })}>
            + Add Task
          </button>
        </div>
      </header>

      <div className="board-wrapper">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="board">
            {columns.map(col => (
              <Column
                key={col.id}
                column={col}
                tasks={filtered.filter(t => t.columnId === col.id)}
                onAddTask={() => setTaskModal({ mode: 'create', columnId: col.id })}
                onEditTask={task => setTaskModal({ mode: 'edit', columnId: col.id, task })}
                onDeleteTask={deleteTask}
                onEditCol={() => { setEditColId(col.id); setColModal(true) }}
                onDeleteCol={() => deleteColumn(col.id)}
                activeTask={activeTask}
              />
            ))}
            <div className="add-column-card">
              <button className="add-column-btn" onClick={() => { setEditColId(null); setColModal(true) }}>
                + Add Column
              </button>
            </div>
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {taskModal && (
        <TaskModal
          mode={taskModal.mode}
          task={taskModal.task}
          columns={columns}
          defaultColumnId={taskModal.columnId}
          onSave={saveTask}
          onClose={() => setTaskModal(null)}
        />
      )}
      {colModal && (
        <ColumnModal
          col={editColId ? columns.find(c => c.id === editColId) : null}
          onSave={saveColumn}
          onClose={() => { setColModal(false); setEditColId(null) }}
        />
      )}
    </>
  )
}