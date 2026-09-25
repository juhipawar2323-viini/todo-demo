import React, { useState } from 'react';
import { Check, Edit3, Trash2, Save, X, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle completion
  const handleToggle = async () => {
    try {
      await onToggle(todo.id, todo.completed);
    } catch (e) {
      console.error('Failed to toggle completion:', e);
    }
  };

  // Submit inline edits
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSaving(true);
    try {
      const res = await onEdit(todo.id, {
        title: editTitle.trim(),
        description: editDesc.trim() || null
      });
      if (res?.success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel inline editing
  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditing(false);
  };

  // Delete item with user confirmation
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      setIsDeleting(true);
      await onDelete(todo.id);
    }
  };

  return (
    <div
      className={`todo-item animate-fade-in ${todo.completed ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      {/* Checkbox */}
      {!isEditing && (
        <button
          type="button"
          className="custom-checkbox-btn"
          onClick={handleToggle}
          title={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
          id={`todo-toggle-${todo.id}`}
        >
          <div className="custom-checkbox">
            <Check size={14} strokeWidth={3} />
          </div>
        </button>
      )}

      {/* Main Content Area */}
      <div className="todo-content">
        {isEditing ? (
          <form onSubmit={handleSave} className="todo-edit-form" id={`edit-form-${todo.id}`}>
            <input
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Todo title"
              required
              autoFocus
              id={`edit-title-input-${todo.id}`}
            />
            <textarea
              className="form-textarea"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              id={`edit-desc-input-${todo.id}`}
            />
            <div className="todo-edit-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancel}
                disabled={isSaving}
                id={`cancel-edit-${todo.id}`}
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSaving || !editTitle.trim()}
                id={`save-edit-${todo.id}`}
              >
                <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h4 className="todo-title">{todo.title}</h4>
            {todo.description && <p className="todo-desc">{todo.description}</p>}
            <div className="todo-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={12} /> {formatDate(todo.created_at)}
              </span>
              {todo.completed && (
                <span
                  style={{
                    color: 'var(--accent-emerald)',
                    fontWeight: 600,
                    fontSize: '0.725rem'
                  }}
                >
                  ✓ Completed
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="todo-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(true)}
            title="Edit todo"
            id={`edit-btn-${todo.id}`}
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete todo"
            id={`delete-btn-${todo.id}`}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
