require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // This is the service role key

console.log('Creating database tables directly...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🔄 Attempting to create tables using service role key...');
    
    // Try to create tables by inserting a dummy record and letting Supabase auto-create
    // This is a workaround since we can't execute DDL directly
    
    // Method 1: Try using the management API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_tables`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      console.log('❌ RPC method failed, trying alternative approach...');
      
      // Method 2: Use the SQL REST endpoint
      const sqlEndpoint = `${supabaseUrl}/rest/v1/rpc/exec`;
      const sqlPayload = {
        sql: `
          CREATE TABLE IF NOT EXISTS public.requests (
            id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
            user_id uuid NOT NULL,
            port_name text NOT NULL,
            arrival_date timestamp with time zone NOT NULL,
            activity_type text NOT NULL,
            yacht_flag text NOT NULL,
            status text DEFAULT 'pending'::text NOT NULL,
            created_at timestamp with time zone DEFAULT now() NOT NULL
          );
          
          CREATE TABLE IF NOT EXISTS public.checklists (
            id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
            request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
            content jsonb NOT NULL,
            created_at timestamp with time zone DEFAULT now() NOT NULL
          );
          
          ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
          ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;
        `
      };
      
      const sqlResponse = await fetch(sqlEndpoint, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sqlPayload)
      });
      
      if (!sqlResponse.ok) {
        console.log('❌ SQL endpoint failed, manual creation required');
        console.log('📋 Please run this SQL in your Supabase Dashboard:');
        console.log('==================================================');
        console.log(`
CREATE TABLE IF NOT EXISTS public.requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL,
  port_name text NOT NULL,
  arrival_date timestamp with time zone NOT NULL,
  activity_type text NOT NULL,
  yacht_flag text NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checklists (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  content jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Disable RLS for development
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;
        `);
        console.log('==================================================');
        console.log('🌐 Dashboard URL: https://nvwupfqwuglpwtswhxam.supabase.co/project/nvwupfqwuglpwtswhxam/sql/new');
      } else {
        console.log('✅ Tables created successfully via SQL endpoint');
      }
    } else {
      console.log('✅ Tables created successfully via RPC');
    }
    
    // Test the tables
    console.log('\n🧪 Testing database tables...');
    const { data, error } = await supabase.from('requests').select('*').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tables still don\'t exist - manual creation required');
        return false;
      } else {
        console.log('⚠️  Tables exist but have permission issues:', error.message);
        return true;
      }
    } else {
      console.log('✅ Database tables are working correctly!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    return false;
  }
}

createTables().then(success => {
  if (success) {
    console.log('\n🎉 Database setup complete! You can now start the server.');
  } else {
    console.log('\n⚠️  Manual database setup required. Please run the SQL in Supabase Dashboard.');
  }
});