'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (task.trim() === '') return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: task }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const markTask = async (id, current) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !current }),
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const editTask = async (id, newText) => {
    if (!newText.trim()) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updated : t)));
    setEditingId(null);
    setEditText('');
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h1>📝 To-Do List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
        onKeyDown={(e) => e.key === 'Enter' && addTask()}
        style={{ width: '70%', padding: 8 }}
      />
      <button onClick={addTask} style={{ padding: 8, marginLeft: 8 }}>Add</button>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {tasks.map((t) => (
          <li key={t._id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => markTask(t._id, t.completed)}
            />

            {editingId === t._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') editTask(t._id, editText);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                  style={{ flexGrow: 1, marginLeft: 10 }}
                />
                <button onClick={() => editTask(t._id, editText)}>✅</button>
                <button onClick={() => setEditingId(null)}>❌</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: t.completed ? 'line-through' : 'none',
                    marginLeft: 10,
                    flexGrow: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setEditingId(t._id);
                    setEditText(t.text);
                  }}
                >
                  {t.text}
                </span>
                <button onClick={() => deleteTask(t._id)} style={{ marginLeft: 10 }}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
