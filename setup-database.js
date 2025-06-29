require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // This is actually the service role key

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

// Use the key (which is actually service role) for schema operations
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database schema...');
  console.log('\n⚠️  IMPORTANT: You need to run the SQL schema manually in Supabase Dashboard:');
  console.log('1. Go to https://nvwupfqwuglpwtswhxam.supabase.co/project/nvwupfqwuglpwtswhxam/sql/new');
  console.log('2. Copy and paste the contents of supabase/00_initial_schema.sql');
  console.log('3. Click "Run" to execute the schema\n');
  
  console.log('For now, let me test if tables already exist...\n');
  
  // Test current state
  const { data, error } = await supabase.from('requests').select('*').limit(1);
  
  if (error) {
    if (error.code === '42P01') {
      console.log('❌ Tables do not exist yet. Please run the SQL schema in Supabase Dashboard.');
      console.log('\nAlternatively, here is the SQL to run:');
      console.log('=====================================================');
      console.log(`
-- Create the 'requests' table to store user queries
CREATE TABLE public.requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    port_name text NOT NULL,
    arrival_date timestamp with time zone NOT NULL,
    activity_type text NOT NULL,
    yacht_flag text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'checklists' table to store generated results
CREATE TABLE public.checklists (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Disable RLS for development (re-enable for production)
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;
      `);
      console.log('=====================================================');
    } else {
      console.error('Database error:', error);
    }
  } else {
    console.log('✅ Database tables exist and are accessible!');
    console.log('✅ Database setup is complete!');
  }
}

setupDatabase();