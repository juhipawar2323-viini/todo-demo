const supabase = require('../config/supabase');

/**
 * Todo Model
 * Encapsulates all direct database queries for the `todos` table.
 * Strictly guarantees that every query is scoped to the user_id.
 */
class TodoModel {
  /**
   * Find all todos belonging to a specific user
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Array>}
   */
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Find single todo by ID and verify ownership
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Object|null>}
   */
  static async findByIdAndUserId(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  }

  /**
   * Create a new todo for the authenticated user
   * @param {Object} todoData - { userId, title, description }
   * @returns {Promise<Object>}
   */
  static async create({ userId, title, description = '' }) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          description: description ? description.trim() : null,
          completed: false
        }
      ])
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update an existing todo owned by the user
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @param {Object} updates - Fields to update { title, description, completed }
   * @returns {Promise<Object|null>}
   */
  static async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  }

  /**
   * Delete a todo owned by the user
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<boolean>}
   */
  static async delete(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id');

    if (error) {
      throw error;
    }

    return Array.isArray(data) && data.length > 0;
  }
}

module.exports = TodoModel;
