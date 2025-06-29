require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure to create a .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
