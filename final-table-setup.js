require('dotenv').config({ path: '/Users/user/CascadeProjects/PortCall_AI/backend/.env' });

console.log('🎯 FINAL TABLE SETUP ATTEMPT');
console.log('=====================================');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('- URL:', supabaseUrl ? '✅' : '❌');
console.log('- Key:', supabaseKey ? '✅' : '❌');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
});

async function finalSetup() {
  console.log('\n🚀 Attempting final table creation...');
  
  try {
    // Method 1: Direct SQL via PostgREST
    console.log('📊 Method 1: Testing direct SQL execution...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        statement: `
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
        `
      })
    });
    
    if (response.ok) {
      console.log('✅ SQL execution successful!');
    } else {
      const error = await response.text();
      console.log('❌ SQL execution failed:', error);
    }
    
    // Method 2: Try using RPC with custom function
    console.log('\n📊 Method 2: Testing RPC approach...');
    
    // Since we can't create tables directly, let's test if they exist
    const { data: testData, error: testError } = await supabase
      .from('requests')
      .select('count')
      .limit(1);
      
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Tables do not exist and cannot be created automatically');
        console.log('\n🏗️  REQUIRED MANUAL SETUP:');
        console.log('==================================');
        console.log('You MUST manually create the tables in Supabase Dashboard:');
        console.log('');
        console.log('1. 🌐 Go to: https://supabase.com/dashboard/projects');
        console.log('2. 🔍 Find your project: nvwupfqwuglpwtswhxam');
        console.log('3. 📝 Go to SQL Editor');
        console.log('4. 📋 Copy and paste this SQL:');
        console.log('');
        console.log('```sql');
        console.log('CREATE TABLE public.requests (');
        console.log('  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,');
        console.log('  user_id uuid NOT NULL,');
        console.log('  port_name text NOT NULL,');
        console.log('  arrival_date timestamp with time zone NOT NULL,');
        console.log('  activity_type text NOT NULL,');
        console.log('  yacht_flag text NOT NULL,');
        console.log('  status text DEFAULT \'pending\'::text NOT NULL,');
        console.log('  created_at timestamp with time zone DEFAULT now() NOT NULL');
        console.log(');');
        console.log('');
        console.log('CREATE TABLE public.checklists (');
        console.log('  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,');
        console.log('  request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,');
        console.log('  content jsonb NOT NULL,');
        console.log('  created_at timestamp with time zone DEFAULT now() NOT NULL');
        console.log(');');
        console.log('');
        console.log('ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;');
        console.log('ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;');
        console.log('```');
        console.log('');
        console.log('5. ▶️  Click "RUN" to execute');
        console.log('6. ✅ Then run: node check-status.js');
        console.log('');
        return false;
      } else {
        console.log('⚠️  Unexpected error:', testError);
        return false;
      }
    } else {
      console.log('🎉 Tables already exist and are working!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return false;
  }
}

finalSetup().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! Database is ready!');
    console.log('📋 Next steps:');
    console.log('1. Start backend: npm start');
    console.log('2. Start frontend: npm start (in frontend folder)');
    console.log('3. Test the application');
  } else {
    console.log('\n⚠️  Manual setup required - follow the instructions above');
  }
});