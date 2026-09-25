import React from 'react';
import { TodoItem } from './TodoItem';
import { CheckCircle2, Inbox } from 'lucide-react';

export const TodoList = ({ todos, onToggle, onEdit, onDelete, filter, onResetFilter }) => {
  if (todos.length === 0) {
    return (
      <div className="glass-panel empty-state" id="empty-todos-state">
        <div className="empty-icon-wrap">
          {filter === 'completed' ? (
            <CheckCircle2 size={36} color="var(--primary-500)" />
          ) : (
            <Inbox size={36} color="var(--primary-500)" />
          )}
        </div>
        <h3 className="empty-title">
          {filter === 'all'
            ? 'No tasks in your list yet'
            : filter === 'active'
            ? 'No active tasks found'
            : 'No completed tasks yet'}
        </h3>
        <p className="empty-subtitle">
          {filter === 'all'
            ? 'Create your first task above to organize your day and boost your productivity!'
            : 'Try changing your filter or add new todos to keep track of your goals.'}
        </p>
        {filter !== 'all' && (
          <button className="btn btn-secondary btn-sm" onClick={onResetFilter}>
            View All Todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="todo-list" id="todo-items-container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
