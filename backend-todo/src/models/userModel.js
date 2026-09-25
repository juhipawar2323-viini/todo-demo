const supabase = require('../config/supabase');

/**
 * User Model
 * Encapsulates all direct database queries for the `users` table.
 */
class UserModel {
  /**
   * Find user by email (including password hash for authentication)
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Direct query (works when service_role key is used)
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password, created_at, updated_at')
      .eq('email', normalizedEmail)
      .single();

    if (data) {
      return data;
    }

    // 2. If blocked by RLS or not found, try secure function
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_user_by_email', { p_email: normalizedEmail });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return rpcData[0];
      }
    } catch (e) {
      // Fall through to return null
    }

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means 0 rows found, which is a normal not-found condition
      console.warn('Database findByEmail notice:', error.message);
    }

    return null;
  }

  /**
   * Find user by ID (excluding password hash)
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  }

  /**
   * Create new user record
   * @param {Object} userData - { name, email, password (hashed) }
   * @returns {Promise<Object>}
   */
  static async create({ name, email, password }) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password
        }
      ])
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = UserModel;
