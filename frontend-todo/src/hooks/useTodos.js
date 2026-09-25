import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create new todo
  const addTodo = async (data) => {
    try {
      const newTodo = await todoService.create(data);
      setTodos((prev) => [newTodo, ...prev]);
      return { success: true, todo: newTodo };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create todo' };
    }
  };

  // Toggle completed status (optimistic update)
  const toggleTodo = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    // Optimistic state update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextStatus } : t))
    );

    try {
      await todoService.update(id, { completed: nextStatus });
    } catch (err) {
      // Revert if error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: currentStatus } : t))
      );
      throw err;
    }
  };

  // Update title / description
  const editTodo = async (id, updates) => {
    try {
      const updated = await todoService.update(id, updates);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update todo' };
    }
  };

  // Delete todo (optimistic update)
  const removeTodo = async (id) => {
    const backup = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.delete(id);
      return { success: true };
    } catch (err) {
      // Revert on error
      setTodos(backup);
      return { success: false, error: err.message || 'Failed to delete todo' };
    }
  };

  // Filtered and searched todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Filter tab
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = todo.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [todos, filter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, percent };
  }, [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
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
  };
};
