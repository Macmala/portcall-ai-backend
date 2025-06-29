require('dotenv').config();
const axios = require('axios');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // service role key

async function createTables() {
  try {
    console.log('Creating database tables via REST API...');
    
    const sqlCommands = [
      `CREATE TABLE public.requests (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid NOT NULL,
        port_name text NOT NULL,
        arrival_date timestamp with time zone NOT NULL,
        activity_type text NOT NULL,
        yacht_flag text NOT NULL,
        status text DEFAULT 'pending'::text NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );`,
      
      `CREATE TABLE public.checklists (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
        content jsonb NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );`,
      
      `ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;`
    ];
    
    for (let i = 0; i < sqlCommands.length; i++) {
      console.log(`Executing SQL command ${i + 1}/${sqlCommands.length}...`);
      
      try {
        const response = await axios.post(
          `${supabaseUrl}/rest/v1/rpc/exec_sql`,
          { sql: sqlCommands[i] },
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );
        console.log(`✅ Command ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing command ${i + 1}:`, error.response?.data || error.message);
        // Continue with other commands
      }
    }
    
    console.log('\nTesting database connection...');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase.from('requests').select('*').limit(1);
    
    if (error) {
      console.error('❌ Test failed:', error);
    } else {
      console.log('✅ Database test successful!');
    }
    
  } catch (err) {
    console.error('Setup failed:', err);
  }
}

createTables();