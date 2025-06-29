require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test a simple query
    const { data, error } = await supabase.from('requests').select('*').limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
    } else {
      console.log('Connection successful! Data:', data);
    }
  } catch (err) {
    console.error('Test error:', err);
  }
}

testConnection();