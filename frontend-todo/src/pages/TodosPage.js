import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  CheckCircle,
  Clock,
  ListTodo,
  Search,
  Sparkles,
  Check
} from 'lucide-react';

export const TodosPage = () => {
  const { user } = useAuth();
  const {
    todos,
    allTodos,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    fetchTodos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo
  } = useTodos();

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleAddTodo = async (data) => {
    const res = await addTodo(data);
    if (res.success) {
      showToast('Todo added successfully!');
    }
    return res;
  };

  const handleToggle = async (id, currentStatus) => {
    await toggleTodo(id, currentStatus);
    showToast(!currentStatus ? 'Task completed! Great job! 🎉' : 'Task marked as active');
  };

  const handleEdit = async (id, updates) => {
    const res = await editTodo(id, updates);
    if (res.success) {
      showToast('Task updated successfully');
    }
    return res;
  };

  const handleDelete = async (id) => {
    const res = await removeTodo(id);
    if (res.success) {
      showToast('Task deleted');
    }
    return res;
  };

  return (
    <div className="todos-dashboard-container animate-fade-in" id="todos-dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast success" id="dashboard-toast">
          <Check size={18} color="var(--accent-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Greetings */}
      <div className="dashboard-header">
        <div className="dashboard-title-row">
          <div>
            <h1>My Daily Tasks</h1>
            <p>
              Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user?.name}</strong>! Keep
              track of your goals and progress.
            </p>
          </div>
        </div>

        {/* Stats Metric Cards */}
        <div className="stats-grid">
          <div className="glass-panel stat-card" id="stat-total-card">
            <div className="stat-icon total">
              <ListTodo size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="glass-panel stat-card" id="stat-completed-card">
            <div className="stat-icon completed">
              <CheckCircle size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="glass-panel stat-card" id="stat-pending-card">
            <div className="stat-icon pending">
              <Clock size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        {/* Completion Progress Bar */}
        {stats.total > 0 && (
          <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={15} color="var(--primary-500)" /> Completion Rate
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{stats.percent}%</strong>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${stats.percent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Add Todo Form */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Filters and Search Toolbar */}
      <div className="toolbar">
        <div className="filter-pills" id="todo-filter-tabs">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-all-btn"
          >
            All <span className="filter-badge">{stats.total}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            id="filter-active-btn"
          >
            Active <span className="filter-badge">{stats.active}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-completed-btn"
          >
            Completed <span className="filter-badge">{stats.completed}</span>
          </button>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-todos-input"
          />
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={fetchTodos} />}

      {/* Loading state or List */}
      {loading ? (
        <Loading message="Syncing with Supabase database..." />
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filter={filter}
          onResetFilter={() => {
            setFilter('all');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};
