import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Please enter a todo title');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      const res = await onAddTodo({
        title: title.trim(),
        description: description.trim() || undefined
      });

      if (res?.success) {
        setTitle('');
        setDescription('');
      } else if (res?.error) {
        setValidationError(res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel todo-form-card" id="todo-creation-card">
      <div className="todo-form-header">
        <PlusCircle size={22} color="var(--primary-500)" />
        <h3>Create New Todo</h3>
      </div>

      {validationError && (
        <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
          ⚠️ {validationError}
        </p>
      )}

      <form onSubmit={handleSubmit} id="todo-form">
        <div className="form-group">
          <label htmlFor="todo-title-input" className="form-label">
            Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
          </label>
          <input
            id="todo-title-input"
            type="text"
            className="form-input"
            placeholder="e.g. Master Supabase RLS and Express MVC"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={isSubmitting}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="todo-desc-input" className="form-label">
            Description <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>(optional)</span>
          </label>
          <textarea
            id="todo-desc-input"
            className="form-textarea"
            placeholder="Add context, subtasks, or architectural notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={2}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !title.trim()}
            id="add-todo-submit-btn"
          >
            <PlusCircle size={18} />
            {isSubmitting ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>
    </div>
  );
};
