require('dotenv').config();
const supabase = require('./supabaseClient');

async function checkStatus() {
  console.log('🔍 PortCall AI - System Status Check\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PERPLEXITY_API_KEY: ${process.env.PERPLEXITY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}\n`);
  
  // Check database connection
  console.log('🗄️  Database Status:');
  try {
    // Test requests table
    const { data: requestsData, error: requestsError } = await supabase.from('requests').select('*').limit(1);
    if (requestsError) {
      if (requestsError.code === '42P01') {
        console.log('   requests table: ❌ Does not exist');
      } else {
        console.log(`   requests table: ❌ Error: ${requestsError.message}`);
      }
    } else {
      console.log('   requests table: ✅ Exists and accessible');
    }
    
    // Test checklists table
    const { data: checklistsData, error: checklistsError } = await supabase.from('checklists').select('*').limit(1);
    if (checklistsError) {
      if (checklistsError.code === '42P01') {
        console.log('   checklists table: ❌ Does not exist');
      } else {
        console.log(`   checklists table: ❌ Error: ${checklistsError.message}`);
      }
    } else {
      console.log('   checklists table: ✅ Exists and accessible');
    }
    
  } catch (error) {
    console.log(`   Database connection: ❌ Error: ${error.message}`);
  }
  
  console.log('\n📝 Next Steps:');
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('1. ✅ Environment configured');
  } else {
    console.log('1. ❌ Configure environment variables in .env file');
  }
  
  // Check if tables exist
  const { error: tablesError } = await supabase.from('requests').select('*').limit(1);
  if (tablesError && tablesError.code === '42P01') {
    console.log('2. ❌ Create database tables:');
    console.log('   Option A: Go to https://nvwupfqwuglpwtswhxam.supabase.co/project/nvwupfqwuglpwtswhxam/sql/new');
    console.log('   Option B: Copy the SQL from setup-database.js output and run it manually');
    console.log('   Option C: Use Supabase CLI if installed');
  } else {
    console.log('2. ✅ Database tables exist');
  }
  
  console.log('3. Start the server: npm start');
  console.log('4. Test the API: POST to http://localhost:3001/api/checklist');
  
  console.log('\n🚀 Current Status Summary:');
  const envOK = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.PERPLEXITY_API_KEY && process.env.OPENAI_API_KEY;
  const dbOK = !tablesError || tablesError.code !== '42P01';
  
  if (envOK && dbOK) {
    console.log('   Status: ✅ Ready to run!');
  } else if (envOK && !dbOK) {
    console.log('   Status: ⚠️  Environment OK, but database needs setup');
  } else {
    console.log('   Status: ❌ Needs configuration');
  }
}

checkStatus().catch(console.error);