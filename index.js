require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');
const { generateChecklist } = require('./aiOrchestrator-v2');

// Debug environment variables
console.log('🔍 Environment Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? 'SET' : 'MISSING');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'MISSING');
console.log('PORT:', process.env.PORT || 'NOT SET (using 3001)');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS to explicitly allow the frontend origin
app.use(express.json());

// Using a wide-open CORS policy for debugging the 404 issue.
app.use(cors());

// --- Helper function for async AI processing ---
const processRequest = async (requestId, requestData) => {
  try {
    // Update status to 'processing'
    await supabase.from('requests').update({ status: 'processing' }).eq('id', requestId);

    // Run the AI orchestration
    const checklistJson = await generateChecklist(requestData);

    // Insert the result into the 'checklists' table
    const { error: checklistError } = await supabase.from('checklists').insert({
      request_id: requestId,
      content: checklistJson
    });
    if (checklistError) throw checklistError;

    // Update status to 'completed'
    await supabase.from('requests').update({ status: 'completed' }).eq('id', requestId);
    console.log(`Successfully completed request ${requestId}`);

  } catch (error) {
    console.error(`Error processing request ${requestId}:`, error);
    // Update status to 'failed'
    await supabase.from('requests').update({ status: 'failed' }).eq('id', requestId);
  }
};

// --- API Routes ---

// Test route to check if the server is alive
app.get('/', (req, res) => {
  res.status(200).send('PortCall AI Backend is running!');
});

app.post('/api/checklist', async (req, res) => {
  const { port_name, arrival_date, activity_type, yacht_flag } = req.body;
  const user_id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Dummy user ID for now

  if (!port_name || !arrival_date || !activity_type || !yacht_flag) {
    return res.status(400).json({ error: 'Missing required form fields.' });
  }

  // 1. Insert into 'requests' table
  const { data, error } = await supabase
    .from('requests')
    .insert({ user_id, port_name, arrival_date, activity_type, yacht_flag })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    if (error.code === '42P01') {
      return res.status(500).json({ 
        error: 'Database tables not found. Please run the setup script: node setup-database.js',
        details: error.message,
        solution: 'Run the SQL schema in your Supabase dashboard or use the setup script provided.'
      });
    }
    return res.status(500).json({ 
      error: 'Failed to create request.',
      details: error.message,
      code: error.code
    });
  }

  const requestId = data.id;
  console.log(`New request created with ID: ${requestId}`);

  // 2. Start async AI processing (don't wait for it to finish)
  processRequest(requestId, req.body);

  // 3. Respond immediately to the user
  res.status(202).json({ requestId });
});

app.get('/api/checklist/:id/status', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('requests')
    .select('status')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  res.status(200).json({ status: data.status });
});

app.get('/api/checklist/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('checklists')
    .select('content')
    .eq('request_id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Checklist not found or not ready.' });
  }

  res.status(200).json(data.content);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend server listening on 0.0.0.0:${port}`);
  console.log(`🌐 Public URL: https://portcall-ai-backend-production.up.railway.app`);
});
