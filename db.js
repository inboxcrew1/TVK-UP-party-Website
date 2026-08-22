const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
if (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) {
  supabase
    .from('Member')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Connection error:', error);
      else console.log('Connected:', data);
    })
    .catch((err) => {
      console.error('Supabase connection error:', err.message);
    });
}

module.exports = supabase;
