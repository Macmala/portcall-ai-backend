require('dotenv').config();
const { Client } = require('pg');

// Extract connection details from Supabase URL
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_ANON_KEY;

// Convert Supabase URL to Postgres connection string
const dbUrl = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const projectRef = dbUrl;

async function setupDatabase() {
  console.log('Setting up database via direct PostgreSQL connection...');
  
  // Connection configuration for Supabase
  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: serviceKey, // Using service key as password - this might not work
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create tables
    const sqlCommands = [
      `CREATE TABLE IF NOT EXISTS public.requests (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid NOT NULL,
        port_name text NOT NULL,
        arrival_date timestamp with time zone NOT NULL,
        activity_type text NOT NULL,
        yacht_flag text NOT NULL,
        status text DEFAULT 'pending'::text NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );`,
      
      `CREATE TABLE IF NOT EXISTS public.checklists (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
        content jsonb NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );`,
      
      `ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;`
    ];

    for (let i = 0; i < sqlCommands.length; i++) {
      console.log(`Executing command ${i + 1}/${sqlCommands.length}...`);
      await client.query(sqlCommands[i]);
      console.log(`✅ Command ${i + 1} executed successfully`);
    }

    console.log('✅ Database setup completed!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n⚠️  Direct connection failed. You need to manually run the SQL schema.');
    console.log('Please go to your Supabase Dashboard and run the SQL from supabase/00_initial_schema.sql');
  } finally {
    await client.end();
  }
}

setupDatabase();