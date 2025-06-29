require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  try {
    // Test connection with a simple auth check
    const { data, error } = await supabase.auth.getUser();
    console.log('Auth test:', error ? 'Failed' : 'Success');
    
    // Try to list tables or check the structure
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tableError) {
      console.error('Cannot list tables:', tableError);
    } else {
      console.log('Available tables:', tables);
    }
  } catch (err) {
    console.error('Test error:', err);
  }
}

testTables();