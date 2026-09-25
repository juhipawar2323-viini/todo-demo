const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn(
    '⚠️ Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend-todo/.env'
  );
}

// Initializing Supabase client with Service Role Key
// Service role key allows backend to execute administrative and verified auth tasks safely.
const supabase = createClient(
  config.supabase.url || 'https://wicascsluggzcvynzvom.supabase.co',
  config.supabase.serviceRoleKey || 'placeholder-service-role-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

module.exports = supabase;
